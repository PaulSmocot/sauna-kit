// Toate cotele sunt în metri. Originea (0,0,0) e colțul exterior stânga-spate, la nivelul pavelelor.
// x: stânga → dreapta, y: în sus, z: spate → față (ușa e pe fața z = 2).

export const E = 0.0375;            // retragerea cadrului față de marginea exterioară
export const FB = 0.03;             // cadrul podelei: jos
export const FT = 0.13;             // cadrul podelei: sus
export const F = 0.148;             // fața podelei (OSB 18)
export const FF = F + 0.028;        // fața gresiei în interior (fibrociment 10 + hidroizolație + adeziv + gresie)
export const SFX = 0.98, SFZ = 1.55; // poziția sifonului
export const HT = F + 2.06;        // vârful pereților
export const YJ = HT + 0.10;        // vârful grinzilor de tavan
export const YT = YJ + 0.012;       // vârful OSB 12
export const I0 = 0.1755;           // fața interioară (stânga / spate)
export const I1 = 2 - I0;           // fața interioară (dreapta / față)
export const CI = HT - 0.038;       // tavanul interior

// golul ușii (peretele din față)
export const DX0 = 1.02;
export const DX1 = 1.74;
export const DY0 = F;
export const DY1 = F + 1.91;

export const JX = [0.0375, 0.65, 1.2625, 1.9125];  // grinzile podelei (fața stângă)
export const PZ = [0.2, 1.0, 1.8];                  // rândurile de suporți
export const GZ = [0.0375, 0.63, 1.2375, 1.9125];   // grinzile tavanului (fața din spate)

// fețele montanților, măsurate de-a lungul fiecărui perete
export const ST: Record<'back' | 'left' | 'right' | 'front', number[]> = {
  back: [0.0375, 0.6675, 1.2975, 1.9125],
  left: [0.1375, 0.7675, 1.3975, 1.8125],
  right: [0.1375, 0.7675, 1.3975, 1.8125],
  front: [0.0375, 0.5, 0.97, 1.74, 1.9125]
};
