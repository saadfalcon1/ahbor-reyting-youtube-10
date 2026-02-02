import { insuranceData as janData } from "./data-jan"
import { insuranceData as febData } from "./data-feb"
import { insuranceData as marData } from "./data-mar"
import { insuranceData as aprData } from "./data-apr"
import { insuranceData as mayData } from "./data-may"
import { insuranceData as junData } from "./data-jun"
import { insuranceData as julData } from "./data-jul"
import { insuranceData as augData } from "./data-aug"
import { insuranceData as sepData } from "./data-sep"
import { insuranceData as octData } from "./data-oct"
import { insuranceData as novData } from "./data-nov"
import { insuranceData as decData } from "./data-dec"

export const INSURANCE_BY_MONTH = {
  jan: janData,
  feb: febData,
  mar: marData,
  apr: aprData,
  may: mayData,
  jun: junData,
  jul: julData,
  aug: augData,
  sep: sepData,
  oct: octData,
  nov: novData,
  dec: decData,
} as const
