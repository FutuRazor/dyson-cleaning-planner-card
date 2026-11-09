// Geometry is expressed in the displayed, rotated image's normalised coordinates.
export function validZoneCalibration(c) {
  return c?.version === 1 && c.units === 'm' && /^\d+$/.test(String(c.map_id)) && Number(c.map_id) > 0
    && ['image_width', 'image_height', 'pixels_per_metre'].every(k => Number.isFinite(c[k]) && c[k] > 0)
    && ['padding', 'min_x', 'max_y'].every(k => Number.isFinite(c[k])) && c.padding >= 0
    && /^[a-f0-9]{64}$/.test(c.image_sha256);
}

export function zoneRobotRectangle(rect, calibration, rotation = 0) {
  if (!validZoneCalibration(calibration) || ![0, 90, 180, 270].includes(rotation)
      || !Array.isArray(rect) || rect.length !== 4 || rect.some(v => !Number.isFinite(v) || v < 0 || v > 1)
      || rect[0] >= rect[2] || rect[1] >= rect[3]) throw new Error('Invalid zone geometry');
  const points = [[rect[0], rect[1]], [rect[2], rect[1]], [rect[2], rect[3]], [rect[0], rect[3]]].map(([u, v]) => {
    const [x, y] = rotation === 90 ? [v, 1-u] : rotation === 180 ? [1-u, 1-v] : rotation === 270 ? [1-v, u] : [u, v];
    return [calibration.min_x + (x * calibration.image_width - calibration.padding) / calibration.pixels_per_metre,
      calibration.max_y - (y * calibration.image_height - calibration.padding) / calibration.pixels_per_metre];
  });
  return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])),
    Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))];
}

export function zoneCanStart(hass, vacuum, camera, calibration, trusted, preview) {
  const state = hass?.states?.[vacuum], cameraState = hass?.states?.[camera];
  return !!(!preview && trusted && hass?.connected !== false && hass?.services?.dyson_spot_scrub?.clean_zone
    && state && !['unknown', 'unavailable'].includes(state.state) && state.attributes?.ready_to_start === true
    && cameraState && !['unknown', 'unavailable'].includes(cameraState.state) && validZoneCalibration(calibration)
    && String(state.attributes.map_id) === String(calibration.map_id)
    && String(cameraState.attributes?.map_calibration?.map_id) === String(calibration.map_id));
}

// SHA-256 fallback for HA served over plain HTTP, where crypto.subtle is absent.
// The hash binds a camera snapshot to its calibration; it is not authentication.
export function zoneSha256(bytes) {
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const primes = [];
  for (let n = 2; primes.length < 64; n++) if (!primes.some(p => n % p === 0)) primes.push(n);
  const h = primes.slice(0, 8).map(p => (Math.sqrt(p) % 1 * 2 ** 32) >>> 0);
  const k = primes.map(p => (Math.cbrt(p) % 1 * 2 ** 32) >>> 0);
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes); padded[bytes.length] = 128;
  const data = new DataView(padded.buffer), bits = bytes.length * 8;
  data.setUint32(padded.length - 8, Math.floor(bits / 2 ** 32)); data.setUint32(padded.length - 4, bits >>> 0);
  const w = new Uint32Array(64);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = data.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i++) {
      const a = w[i-15], b = w[i-2];
      w[i] = w[i-16] + (rotr(a,7)^rotr(a,18)^(a>>>3)) + w[i-7] + (rotr(b,17)^rotr(b,19)^(b>>>10));
    }
    let [a,b,c,d,e,f,g,j] = h;
    for (let i = 0; i < 64; i++) {
      const t1 = (j + (rotr(e,6)^rotr(e,11)^rotr(e,25)) + ((e&f)^(~e&g)) + k[i] + w[i]) | 0;
      const t2 = ((rotr(a,2)^rotr(a,13)^rotr(a,22)) + ((a&b)^(a&c)^(b&c))) | 0;
      j=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    [a,b,c,d,e,f,g,j].forEach((v,i) => { h[i]=(h[i]+v)>>>0; });
  }
  return h.map(v => v.toString(16).padStart(8,'0')).join('');
}
