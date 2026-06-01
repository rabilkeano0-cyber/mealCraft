import { Meal, Ingredient } from './types';

export const LOCATIONS = [
  'Sudirman, Jakarta Pusat',
  'Kemang, Jakarta Selatan',
  'Kelapa Gading, Jakarta Utara',
  'Margonda, Depok',
  'BSD City, Tangerang',
  'Malioboro, Yogyakarta',
  'Braga, Bandung',
  'Kuta, Bali',
  'Pemuda, Semarang',
  'Ijen, Malang'
];

export const PAYMENT_METHODS = [
  'COD (Bayar di Tempat)',
  'QRIS',
  'Transfer Bank (BCA, Mandiri, BNI, BRI)',
  'GoPay',
  'OVO',
  'Dana',
  'ShopeePay'
];

const MEAL_DATA = [
  {
    id: 1,
    name: "Croissant Sandwich Smoked Beef (Prancis)",
    price: 40000,
    distance: "1.7 km",
    description: "ROTI CROISSANT RENYAH BERISI IRISAN DAGING ASAP, KEJU, DAN SAYURAN SEGAR.",
    imageUrl: "https://mojo.generalmills.com/api/public/content/NlZKfcL9Rv28Jeo1Qn4shw_gmi_hi_res_jpeg.jpeg?v=c4e7f344&t=eae6004af7d84bc5a9fa522ac84b14a8"
  },
  {
    id: 2,
    name: "Classic Fish and Chips (Inggris)",
    price: 45000,
    distance: "1.1 km",
    description: "IKAN DORY GORENG TEPUNG SUPER RENYAH DENGAN KENTANG GORENG DAN SAUS TARTAR.",
    imageUrl: "https://www.thespruceeats.com/thmb/sdVTq0h7xZvJjPr6bE2fhh5M3NI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SES-best-fish-and-chips-recipe-434856-hero-01-27d8b57008414972822b866609d0af9b.jpg"
  },
  {
    id: 3,
    name: "Peking Duck Roast (Tiongkok)",
    price: 85000,
    distance: "2.1 km",
    description: "BEBEK PANGGANG KHAS BEIJING DENGAN KULIT RENYAH DAN BUMBU AUTENTIK.",
    imageUrl: "https://images.getrecipekit.com/20250611165155-lunar-20new-20year-20peking-20duck-20whole-2023-20copy.webp?aspect_ratio=1:1&quality=90&"
  },
  {
    id: 4,
    name: "Dim Sum Hakau Udang (Hong Kong)",
    price: 28000,
    distance: "5.1 km",
    description: "HAKAU KUKUS DENGAN ISIAN UDANG SEGAR DAN KULIT YANG LEMBUT TRANSPARAN.",
    imageUrl: "https://asset.kompas.com/crops/qK5SgGe89V44eAziu65Qjf07eU4=/0x10:968x655/1200x800/data/photo/2024/01/30/65b87d3e40a77.jpg"
  },
  {
    id: 5,
    name: "Sushi Roll Salmon & Avocado (Jepang)",
    price: 45000,
    distance: "5.0 km",
    description: "GULUNGAN NASI JEPANG DENGAN POTONGAN SALMON SEGAR DAN ALPUKAT CREAMY.",
    imageUrl: "https://media.istockphoto.com/id/1248602978/id/foto/sushi-roll-philadelphia-dengan-salmon-alpukat-krim-keju-menu-sushi-makanan-jepang-latar.jpg?s=612x612&w=0&k=20&c=KBXsGANNRkzWV3Fg8sHfARpdOma31dhfzrt-OUW6phg="
  },
  {
    id: 6,
    name: "Margherita Pizza Authentica (Italia)",
    price: 65000,
    distance: "3.1 km",
    description: "PIZZA KLASIK ITALIA DENGAN SAUS TOMAT, MOZZARELLA SEGAR, DAN DAUN BASIL.",
    imageUrl: "https://rms.condenast.it/rms/public/5d3/f0a/c95/5d3f0ac95a3f1529289300.jpg"
  },
  {
    id: 7,
    name: "Beef Taco Supreme (Meksiko)",
    price: 35000,
    distance: "4.9 km",
    description: "KULIT TACO RENYAH BERISI DAGING SAPI CINCANG, SAYURAN, DAN SAUS SALSA.",
    imageUrl: "https://images.squarespace-cdn.com/content/v1/5d529b54c9e4c40001de375f/1624056179597-X23A32L0NE5PNV6YY9S8/BeefTacoSupreme-Recipe.jpg"
  },
  {
    id: 8,
    name: "Tom Yum Goong Seafood (Thailand)",
    price: 55000,
    distance: "5.2 km",
    description: "SUP KUAH ASAM PEDAS KHAS THAILAND DENGAN ISIAN UDANG DAN CUMI SEGAR.",
    imageUrl: "https://hot-thai-kitchen.com/wp-content/uploads/2013/03/tom-yum-goong-blog.jpg"
  },
  {
    id: 9,
    name: "Bibimbap Beef Bulgogi (Korea Selatan)",
    price: 50000,
    distance: "1.1 km",
    description: "NASI CAMPUR KOREA DENGAN DAGING SAPI BULGOGI, SAYURAN, DAN SAUS GOCHUJANG.",
    imageUrl: "https://media.hellofresh.com/q_100,w_3840,f_auto,c_limit,fl_lossy/recipes/image/bulgogi-beef-bibimbap-and-fried-egg-fb2844f0-55798820.jpg"
  },
  {
    id: 10,
    name: "Chicken Tikka Masala (India)",
    price: 48000,
    distance: "1.5 km",
    description: "POTONGAN AYAM PANGGANG DALAM KUAH KARI TOMAT YANG KAYA REMPAH.",
    imageUrl: "https://www.allrecipes.com/thmb/1ul-jdOz8H4b6BDrRcYOuNmJgt4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/239867chef-johns-chicken-tikka-masala-ddmfs-3X4-0572-e02a25f8c7b745459a9106e9eb13de10.jpg"
  }
];

export const MOCK_MEALS: Meal[] = MEAL_DATA.map(meal => ({
  id: String(meal.id),
  name: meal.name,
  desc: meal.description,
  price: meal.price,
  distance: parseFloat(meal.distance) || 0,
  img: meal.imageUrl,
  category: "Semua"
}));

export const INGREDIENTS: { bases: Ingredient[], proteins: Ingredient[], veggies: Ingredient[] } = {
  bases: [
      { id: 'b1', name: 'Nasi Merah Organik', price: 10000, cal: 110 },
      { id: 'b2', name: 'Nasi Kuning Rendah Kalori', price: 15000, cal: 120 },
      { id: 'b3', name: 'Salad Sayur Campur', price: 12000, cal: 30 }
  ],
  proteins: [
      { id: 'p1', name: 'Dada Ayam Panggang', price: 20000, cal: 165 },
      { id: 'p2', name: 'Ikan Bakar Rica', price: 30000, cal: 208 },
      { id: 'p3', name: 'Tahu & Tempe Bacem', price: 12000, cal: 76 }
  ],
  veggies: [
      { id: 'v1', name: 'Urap Sayuran', price: 6000, cal: 35 },
      { id: 'v2', name: 'Tumis Kangkung', price: 8000, cal: 40 },
      { id: 'v3', name: 'Sayur Nangka', price: 8000, cal: 90 },
      { id: 'v4', name: 'Sambal Goreng Kentang', price: 10000, cal: 160 }
  ]
};