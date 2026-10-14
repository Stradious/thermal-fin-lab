export function analyzeFin(input) {
  const { length: L, width, thickness, conductivity: k, convectionCoefficient: h, baseTemperature: Tb, ambientTemperature: Ta } = input;
  const samples = input.samples ?? 81;
  for (const [name, value] of Object.entries({ length: L, width, thickness, conductivity: k, convectionCoefficient: h })) {
    if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a finite positive number`);
  }
  if (!Number.isFinite(Tb) || !Number.isFinite(Ta)) throw new Error('Temperatures must be finite numbers');
  if (!Number.isInteger(samples) || samples < 2 || samples > 100001) throw new Error('samples must be an integer from 2 to 100001');
  const area = width * thickness;
  const perimeter = 2 * (width + thickness);
  const m = Math.sqrt(h * perimeter / (k * area));
  const thetaBase = Tb - Ta;
  const x = Array.from({ length: samples }, (_, i) => i * L / (samples - 1));
  // This ratio avoids large cosh(mL) values for long or highly convective fins.
  const ratio = pos => { const a = m * (L - pos), b = m * L; return (Math.exp(a - b) + Math.exp(-a - b)) / (1 + Math.exp(-2 * b)); };
  const temperature = x.map(pos => Ta + thetaBase * ratio(pos));
  const heatWatts = Math.sqrt(h * perimeter * k * area) * thetaBase * Math.tanh(m * L);
  const efficiency = Math.tanh(m * L) / (m * L);
  return { x, temperature, heatWatts, efficiency, finParameter: m, tipTemperature: temperature.at(-1), area, perimeter };
}

export function finSvg(result) {
  const left = 70, right = 860, top = 95, bottom = 390;
  const min = Math.min(...result.temperature), max = Math.max(...result.temperature), range = max - min || 1;
  const points = result.temperature.map((t, i) => `${(left + i / (result.temperature.length - 1) * (right - left)).toFixed(2)},${(bottom - (t - min) / range * (bottom - top)).toFixed(2)}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="920" height="470" viewBox="0 0 920 470"><rect width="100%" height="100%" fill="#101923"/><text x="70" y="42" fill="#fff" font-size="23" font-family="sans-serif">Insulated-tip fin temperature</text><text x="70" y="70" fill="#9ca3af" font-size="14" font-family="sans-serif">Base to tip · ${result.heatWatts.toFixed(2)} W removed · ${(result.efficiency * 100).toFixed(1)}% efficiency</text><line x1="70" y1="390" x2="860" y2="390" stroke="#64748b"/><polyline points="${points}" fill="none" stroke="#fb923c" stroke-width="4"/><text x="70" y="420" fill="#cbd5e1" font-size="14" font-family="sans-serif">0 m</text><text x="860" y="420" text-anchor="end" fill="#cbd5e1" font-size="14" font-family="sans-serif">${result.x.at(-1)} m</text><text x="75" y="115" fill="#fcd34d" font-size="14" font-family="sans-serif">${max.toFixed(1)} °C</text><text x="855" y="375" text-anchor="end" fill="#fcd34d" font-size="14" font-family="sans-serif">${min.toFixed(1)} °C</text></svg>`;
}
