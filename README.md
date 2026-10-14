# Thermal Fin Lab

An analytical model for a straight rectangular fin with a uniform cross-section and an insulated tip. It calculates the temperature profile, heat removed, and fin efficiency, and draws an SVG profile.

## Run

```powershell
node cli.mjs example.json
node --test test.mjs
```

All inputs are SI. The convection coefficient is W/(m²·K), conductivity is W/(m·K), dimensions are m, and temperatures are °C. The model assumes constant material properties, a uniform convection coefficient, perfect contact at the base, and negligible radiation. It is for learning and early sizing, not hardware certification.

Try changing `length` or `convectionCoefficient` to see how heat removal and efficiency trade off.
