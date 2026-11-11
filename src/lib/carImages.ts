export interface CarImageMeta {
  src: string;
  alt: string;
}

export const carImageMap: Record<string, CarImageMeta> = {
  koenigsegg: {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtrvq0R4C0nWn3JPted8Xs7wJ8RB_udeURVSxIZLhKeiQI4BBv3l7jmdhaBe9IW8J6dk8dqTs38QEVT8ME55BHekDVM3xthHf1aUp0w0DcTF2Jgb79wyJOJcpQmmJL8zI_Ou3TlRh_AAZcEPx1wJHZ_rmuqqpt-EVuMzPYuRWzwHCCaIFhFj6dUbFnik5reVFjVWSUINYuJMlrPHngNEUJb9dn6efO02qFeZKPo7U',
    alt: 'Koenigsegg Sport Megacar',
  },
  'nissan-gt-r': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC34t9WOtU-_jyn-sxa2i2KDIKugiCQ-O9Gen2VgqTVxKzajFDtVpbys2eTLrB7lZmF4YYT5Sf2cLQPKtVy4RC7XqXdvxnoqo848PVW5g_h5u5JX6CZauakq4CQMmje5ISEehjGKpFqJH6ClggBCPICQOnXkABuUUGvJMMq-XIc24T7jVj5yHx4w257iMNnTtMGnhG3CoqzVBOnn-kluCNT2A91uy7ZT8KNsUPxO5k',
    alt: 'Nissan GT - R Nismo',
  },
  'rolls-royce': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4sYZGoN3q_Sr8FEOeP4zYgelJC9eqfqq75i3cn2yFlSG4BieAA8hAWuuuJ1pcYvAb6MxXLxeh6S9JbLo35dagrOsbg4ujERkfjSN2vIMewDeMXvo2KRbDlvNLh4EJRSMKbWqOk5bz_OcnqOCtHL0nxwWDmQaGqzAZUC2DGFg9M5VuYbBs3GA-5Amr_fJeddWrMIzMLvP8YnJ-CyBq8Y3gb6M-vm7y7aPaiwzp29o',
    alt: 'Rolls - Royce Luxury Sedan',
  },
  'porsche-911-gt3': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFm6JLHs4C5fPF9v7YwgW-za4M7X0ve3Hk4R6zaLwqHXou7xRw00VFpGgtycmZco4MJjmNNrBcAuVFBxAA0YFhx7CIR8N9nhV907b3I4QPyeIC5I6jDD1fCKOh0W_gpKfPlkF_q3R8hgcL12HDzFThFy5So5quymhlVNqypzVuE2bzXBV5j_PVAyzzVgExkz-w_hLEhPYcC8s8TV6LGwGO_eNaLHjPbtV406AKYJ8',
    alt: 'Porsche 911 GT3 Sport',
  },
  'all-new-rush': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt4uOQzCVMXHoR1o7x_YVzD1ngKycBRY33cGStSauUZqCpqn6seLmvcpXadEC_-Ye5q-QEF09-PRrf4LDBFeG3zDNWy2xK6hIlHTJd_-trPzNA5_to_zbAsUkTBXCV2EzZjEbqbSaEd9bzGjXCB14RdhwvXB8kcKOoT28-myKhaLY-_qKwLHas9vIsWxKQwZ5h9dGwbS_FMmbNxG41OrY_SNsmvn6oi0A0Rvo_Jx0',
    alt: 'All New Rush SUV',
  },
  'cr-v': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq0FCmBLXEEHXIuudbCNN75LOJaVtXYOguCMO3DkNTSIg1FaCInEfpJDfdQAY19nC0gsfq3fv64dsM8icY7sCXWBuWUw3HSZq_T2wpQVgWoop2K7M-8zHIYHiqXfh8ZVSaj-OvWf2-8PrE72Zmj7Lxzqljz_aqGN_mgAC6S7E_PgP8Qa17JedEi6nMutTgaq7_pJ-9FyCZH3W5Vf0SsPqSSvaB682FlVblJP2y1ho',
    alt: 'Honda CR - V SUV',
  },
  'all-new-terios': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt_QlSUUDqTOCcF9uF1m8QtVVSqkIpX27XfQkpjMM6_iHUEVrMVpL5rcGzysywPlmevULVErjyD7hN6lI372QvCE0dOlBFDiyY-uHZZb6Rcv3qubn6imoOYGynQPrOdndzynP74jia75qkAnG9l5R8iAWExISN_pMREA6uzGAPofjZ4hOs2UvgsuJEgctcG7m6Sju074YfPTBzulAD5-vpetmKcfBs8KpOuNIwQkE',
    alt: 'All New Terios Adventure SUV',
  },
  'mg-zx-exclusive': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKh0sWf5E-Z4P0hLgqjX24u35P-lCg7o96t-01z3iN2sW4FpP_J4Qv2qA3F2V7V-fMvC482LqP6sM2g4-h99P2Vv_0QpP',
    alt: 'MG ZX Exclusive SUV',
  },
  'new-mg-zs': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMeKte7Eph1u55Q8ZuLnWD2wty_F8vDGlhERhJBxJu08dSMaC1XZBVWaNfewuvfWDYSWd77TUXJDI53fUiAd0jU2au5tdpBu6ktAe63bOEOuHMMCjoDQAPFzDydHeWAWBi7miPg5TJPCuoG02neE_iHx90cRlO3mUe_pFyBe3sRhWZKqRdZ_HzQH4uk5FvD0CnZWw61LWn1nX9vY68UDCbiuzAl8RtlWB_MfhUzrk',
    alt: 'New MG ZS SUV',
  },
  'mg-zx-excite': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzx5gSqKZK1knWD52AQt4DNFQAQL__vsGvFgeHS28D3o-NZjzgIMSAiAZZO72JkGAiwhbjxq3jpeg36mTAbSGBaoyuDuKxonULXzjSK5bk2LGEw9C9_4Ncvxe-HlQ33AtQVO4pxrkyT9Y9iOKJs5dBPSni1hK93KWgfPS0GgXZorDhZXP3KmAx4tIO7hMrp3ARgiVGhQdDV-U2DinuEpqgDA3as1laFlvN_pELwCo',
    alt: 'MG ZX Excite Sedan',
  },
  'bmw-m4-coupe': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADJ6LEyvcZBLqW0NxOA3TOVQkA_ItaesqWDGrZqSzKypPj8LK46MMnHOUjwTTaWv0UOcLUt6i2pN7wB5LBIpyoY4M8rvS7DIVI2soRXuiXh2sz3t0m3LtUD0fbarCMgcWAho5nFWFpvKEWCo_DqmKZwHzKKvXDz7afYHfe3lCxZ-TsWpuunjs4j9JE5VzaPAwP1-eIwuYLQ6zXEmuzLUnIEZUMhIVbP0C7ZSpphDs',
    alt: 'BMW M4 Coupe',
  },
  'mercedes-benz-v-class': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA853EdBLRuUlOiJ_mGJ3P4lW3BzYJtiVusakEL9OG8lnkUyQuMaCqHd53_k1Ke-WUlt6ZXoQXjMERlgQg9fO8gS8iz8GQbTp86hxfjoCmAzTu5Ehi3cxQfbd_3vi_nG4Ot-oWjCQlrGBjvrrQC2zvrQ-WIs-UCa4hvTgPLT1isT0M15a-bm3UbptI5ivneoYZ0cJiIPgGrb0c8k_1HlO2ImBjpnqn89OkQ0nqQ-tE',
    alt: 'Mercedes-Benz V-Class MPV',
  },
  'audi-rs6-avant': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMeKte7Eph1u55Q8ZuLnWD2wty_F8vDGlhERhJBxJu08dSMaC1XZBVWaNfewuvfWDYSWd77TUXJDI53fUiAd0jU2au5tdpBu6ktAe63bOEOuHMMCjoDQAPFzDydHeWAWBi7miPg5TJPCuoG02neE_iHx90cRlO3mUe_pFyBe3sRhWZKqRdZ_HzQH4uk5FvD0CnZWw61LWn1nX9vY68UDCbiuzAl8RtlWB_MfhUzrk',
    alt: 'Audi RS6 Avant',
  },
  'tesla-model-s-plaid': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADJ6LEyvcZBLqW0NxOA3TOVQkA_ItaesqWDGrZqSzKypPj8LK46MMnHOUjwTTaWv0UOcLUt6i2pN7wB5LBIpyoY4M8rvS7DIVI2soRXuiXh2sz3t0m3LtUD0fbarCMgcWAho5nFWFpvKEWCo_DqmKZwHzKKvXDz7afYHfe3lCxZ-TsWpuunjs4j9JE5VzaPAwP1-eIwuYLQ6zXEmuzLUnIEZUMhIVbP0C7ZSpphDs',
    alt: 'Tesla Model S Plaid',
  },
  'toyota-alphard': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA853EdBLRuUlOiJ_mGJ3P4lW3BzYJtiVusakEL9OG8lnkUyQuMaCqHd53_k1Ke-WUlt6ZXoQXjMERlgQg9fO8gS8iz8GQbTp86hxfjoCmAzTu5Ehi3cxQfbd_3vi_nG4Ot-oWjCQlrGBjvrrQC2zvrQ-WIs-UCa4hvTgPLT1isT0M15a-bm3UbptI5ivneoYZ0cJiIPgGrb0c8k_1HlO2ImBjpnqn89OkQ0nqQ-tE',
    alt: 'Toyota Alphard MPV',
  },
  'volkswagen-golf-r': {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFm6JLHs4C5fPF9v7YwgW-za4M7X0ve3Hk4R6zaLwqHXou7xRw00VFpGgtycmZco4MJjmNNrBcAuVFBxAA0YFhx7CIR8N9nhV907b3I4QPyeIC5I6jDD1fCKOh0W_gpKfPlkF_q3R8hgcL12HDzFThFy5So5quymhlVNqypzVuE2bzXBV5j_PVAyzzVgExkz-w_hLEhPYcC8s8TV6LGwGO_eNaLHjPbtV406AKYJ8',
    alt: 'Volkswagen Golf R Hatchback',
  },
};

const defaultCarImage: CarImageMeta = {
  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC34t9WOtU-_jyn-sxa2i2KDIKugiCQ-O9Gen2VgqTVxKzajFDtVpbys2eTLrB7lZmF4YYT5Sf2cLQPKtVy4RC7XqXdvxnoqo848PVW5g_h5u5JX6CZauakq4CQMmje5ISEehjGKpFqJH6ClggBCPICQOnXkABuUUGvJMMq-XIc24T7jVj5yHx4w257iMNnTtMGnhG3CoqzVBOnn-kluCNT2A91uy7ZT8KNsUPxO5k',
  alt: 'Morent Rental Car',
};

/**
 * Resolves a car's image asset entirely on the frontend without relying
 * on database-stored binary blobs or external image paths.
 */
export function getCarImage(slugOrAssetId?: string): CarImageMeta {
  if (!slugOrAssetId) return defaultCarImage;
  const key = slugOrAssetId.toLowerCase().trim();
  return carImageMap[key] || defaultCarImage;
}
