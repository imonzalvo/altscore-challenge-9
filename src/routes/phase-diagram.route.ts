import { Router, Request, Response } from "express";

const router = Router();

interface PhaseChangeResponse {
  specificVolumeLiquid: number;
  specificVolumeVapor: number;
}

const minPressure = 0.05;
const criticalPressure = 10;
const criticalVolume = 0.0035;
const minVolume = 0.00105;
const maxVolume = 30;

const interpolateLiquidVolume = (pressure: number) => {
  return (
    minVolume +
    ((pressure - minPressure) * (criticalVolume - minVolume)) /
      (criticalPressure - minPressure)
  );
};

const interpolateVaporVolume = (pressure: number) => {
  return (
    maxVolume -
    ((pressure - minPressure) * (maxVolume - criticalVolume)) /
      (criticalPressure - minPressure)
  );
};

function calculateSpecificVolumes(pressure: number): PhaseChangeResponse {
  if (pressure < minPressure || pressure > criticalPressure) {
    throw new Error("Pressure out of range");
  }

  if (pressure === criticalPressure) {
    return {
      specificVolumeLiquid: criticalVolume,
      specificVolumeVapor: criticalVolume,
    };
  }

  // Liquid
  const liquidVolume = interpolateLiquidVolume(pressure);

  // Vapor
  const vaporVolume = interpolateVaporVolume(pressure);

  return {
    specificVolumeLiquid: Number(liquidVolume),
    specificVolumeVapor: Number(vaporVolume),
  };
}

router.get("/phase-change-diagram", (req: Request, res: Response) => {
  const pressure = Number(req.query.pressure);

  const result = calculateSpecificVolumes(pressure);
  res.json(result);
});

export default router;
