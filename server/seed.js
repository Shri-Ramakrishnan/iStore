import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "iPhone 15 Pro",
    model: "iPhone 15 Pro",
    category: "iphone",
    series: "iphone-15",
    isFeatured: true,
    price: 999,
    description: "Titanium. Pro performance. A camera system that goes further.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=png-alpha&.v=1692846363993",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=png-alpha&.v=1692846363993"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colorOptions: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: "128GB",
    color: "Natural Titanium",
    stock: 18,
    countInStock: 18
  },
  {
    name: "iPhone 15 Pro Max",
    model: "iPhone 15 Pro Max",
    category: "iphone",
    series: "iphone-15",
    isFeatured: true,
    price: 1199,
    description: "The ultimate iPhone. Immersive display. Pro camera reach.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=png-alpha&.v=1692845699311",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-bluetitanium?wid=5120&hei=2880&fmt=png-alpha&.v=1692845699311"
    ],
    storageOptions: ["256GB", "512GB", "1TB"],
    colorOptions: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
    storage: "256GB",
    color: "Blue Titanium",
    stock: 12,
    countInStock: 12
  },
  {
    name: "iPhone 15",
    model: "iPhone 15",
    category: "iphone",
    series: "iphone-15",
    isFeatured: true,
    price: 799,
    description: "Dynamic Island. Brilliant camera. Built for everyday power.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1692923777972",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1692923777972"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    colorOptions: ["Blue", "Pink", "Yellow", "Green", "Black"],
    storage: "128GB",
    color: "Blue",
    stock: 22,
    countInStock: 22
  },
  {
    name: "iPhone 15 Plus",
    model: "iPhone 15 Plus",
    category: "iphone",
    series: "iphone-15",
    isFeatured: true,
    price: 899,
    description: "Big-screen brilliance. All-day battery life. Stunning photos.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-7inch-pink?wid=5120&hei=2880&fmt=png-alpha&.v=1692923784895",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-7inch-pink?wid=5120&hei=2880&fmt=png-alpha&.v=1692923784895"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    colorOptions: ["Blue", "Pink", "Yellow", "Green", "Black"],
    storage: "128GB",
    color: "Pink",
    stock: 16,
    countInStock: 16
  },
  {
    name: "iPhone 14 Pro",
    model: "iPhone 14 Pro",
    category: "iphone",
    series: "iphone-14",
    isFeatured: false,
    price: 899,
    description: "Pro camera system. Dynamic Island. Designed to impress.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=png-alpha&.v=1671474898960",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-1inch-deeppurple?wid=5120&hei=2880&fmt=png-alpha&.v=1671474898960"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colorOptions: ["Deep Purple", "Space Black", "Silver", "Gold"],
    storage: "256GB",
    color: "Deep Purple",
    stock: 10,
    countInStock: 10
  },
  {
    name: "iPhone 14 Pro Max",
    model: "iPhone 14 Pro Max",
    category: "iphone",
    series: "iphone-14",
    isFeatured: false,
    price: 999,
    description: "A bigger Pro display with the same pro-level power.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=5120&hei=2880&fmt=png-alpha&.v=1663703841896",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=5120&hei=2880&fmt=png-alpha&.v=1663703841896"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colorOptions: ["Deep Purple", "Space Black", "Silver", "Gold"],
    storage: "256GB",
    color: "Deep Purple",
    stock: 8,
    countInStock: 8
  },
  {
    name: "iPhone 14",
    model: "iPhone 14",
    category: "iphone",
    series: "iphone-14",
    isFeatured: false,
    price: 699,
    description: "A brilliant display. All-day battery life. Built to last.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1661026582322",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1661026582322"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    colorOptions: ["Blue", "Purple", "Midnight", "Starlight", "Red"],
    storage: "128GB",
    color: "Blue",
    stock: 20,
    countInStock: 20
  },
  {
    name: "iPhone 14 Plus",
    model: "iPhone 14 Plus",
    category: "iphone",
    series: "iphone-14",
    isFeatured: false,
    price: 799,
    description: "Big and bright. A battery that keeps going.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1661027942322",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-finish-select-202209-6-7inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1661027942322"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    colorOptions: ["Blue", "Purple", "Midnight", "Starlight", "Red"],
    storage: "128GB",
    color: "Blue",
    stock: 14,
    countInStock: 14
  },
  {
    name: "iPhone 13",
    model: "iPhone 13",
    category: "iphone",
    series: "iphone-13",
    isFeatured: false,
    price: 599,
    description: "Fast A15 Bionic. A camera system that shines in any light.",
    image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1656712888128",
    images: [
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-blue?wid=5120&hei=2880&fmt=png-alpha&.v=1656712888128"
    ],
    storageOptions: ["128GB", "256GB", "512GB"],
    colorOptions: ["Blue", "Midnight", "Starlight", "Pink", "Green"],
    storage: "128GB",
    color: "Blue",
    stock: 18,
    countInStock: 18
  },
  {
    name: "iPhone SE (3rd generation)",
    model: "iPhone SE (3rd generation)",
    category: "iphone",
    series: "iphone-se",
    isFeatured: false,
    price: 429,
    description: "Serious power. Classic design. The A15 Bionic chip inside.",
    image: "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-se-storage-select-202207-midnight?wid=5120&hei=2880&fmt=png-alpha&.v=1655312146228",
    images: [
      "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-se-storage-select-202207-midnight?wid=5120&hei=2880&fmt=png-alpha&.v=1655312146228"
    ],
    storageOptions: ["64GB", "128GB", "256GB"],
    colorOptions: ["Midnight", "Starlight", "Red"],
    storage: "64GB",
    color: "Midnight",
    stock: 24,
    countInStock: 24
  },
  {
    name: "AirPods Pro (2nd generation)",
    model: "AirPods Pro (2nd generation)",
    category: "airpods",
    series: "airpods",
    isFeatured: false,
    price: 249,
    description: "Adaptive Audio. Active Noise Cancellation. A magical fit.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=2000&hei=2000&fmt=png-alpha&.v=1694014871985",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=2000&hei=2000&fmt=png-alpha&.v=1694014871985"
    ],
    storageOptions: ["Standard"],
    colorOptions: ["White"],
    storage: "Standard",
    color: "White",
    stock: 40,
    countInStock: 40
  },
  {
    name: "AirPods (3rd generation)",
    model: "AirPods (3rd generation)",
    category: "airpods",
    series: "airpods",
    isFeatured: false,
    price: 179,
    description: "Spatial Audio with dynamic head tracking. Effortless setup.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=2000&hei=2000&fmt=png-alpha&.v=1632861342000",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=2000&hei=2000&fmt=png-alpha&.v=1632861342000"
    ],
    storageOptions: ["Standard"],
    colorOptions: ["White"],
    storage: "Standard",
    color: "White",
    stock: 35,
    countInStock: 35
  },
  {
    name: "Apple Watch Series 9",
    model: "Apple Watch Series 9",
    category: "watch",
    series: "watch-series-9",
    isFeatured: false,
    price: 399,
    description: "Powerful sensors. Brilliant display. Health at a glance.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTFA3ref_VW_34FR+watch-case-45-aluminum-starlight-nc-s9_VW_34FR+watch-face-45-aluminum-starlight-s9_VW_34FR_WF_CO?wid=5120&hei=3280&trim=1&fmt=png-alpha",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTFA3ref_VW_34FR+watch-case-45-aluminum-starlight-nc-s9_VW_34FR+watch-face-45-aluminum-starlight-s9_VW_34FR_WF_CO?wid=5120&hei=3280&trim=1&fmt=png-alpha"
    ],
    storageOptions: ["GPS", "GPS + Cellular"],
    colorOptions: ["Starlight", "Midnight", "Silver", "Pink"],
    storage: "GPS",
    color: "Starlight",
    stock: 30,
    countInStock: 30
  },
  {
    name: "Apple Watch Ultra 2",
    model: "Apple Watch Ultra 2",
    category: "watch",
    series: "watch-ultra",
    isFeatured: false,
    price: 799,
    description: "Rugged. Capable. Built for endurance and adventure.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT5J3ref_VW_34FR+watch-49-titanium-ultra2_VW_34FR+watch-face-49-alpine-ultra2_VW_34FR?wid=5120&hei=3280&trim=1&fmt=png-alpha",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT5J3ref_VW_34FR+watch-49-titanium-ultra2_VW_34FR+watch-face-49-alpine-ultra2_VW_34FR?wid=5120&hei=3280&trim=1&fmt=png-alpha"
    ],
    storageOptions: ["GPS + Cellular"],
    colorOptions: ["Titanium"],
    storage: "GPS + Cellular",
    color: "Titanium",
    stock: 18,
    countInStock: 18
  },
  {
    name: "iPad Pro 11-inch",
    model: "iPad Pro 11-inch",
    category: "ipad",
    series: "ipad-pro",
    isFeatured: false,
    price: 799,
    description: "Ultra-thin. Ultra-fast. A pro display for pro work.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-202210?wid=970&hei=1020&fmt=png-alpha&.v=1664411207110",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-11-select-202210?wid=970&hei=1020&fmt=png-alpha&.v=1664411207110"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB"],
    colorOptions: ["Space Gray", "Silver"],
    storage: "128GB",
    color: "Space Gray",
    stock: 20,
    countInStock: 20
  },
  {
    name: "iPad Pro 12.9-inch",
    model: "iPad Pro 12.9-inch",
    category: "ipad",
    series: "ipad-pro",
    isFeatured: false,
    price: 1099,
    description: "A spacious canvas. Brilliant Liquid Retina XDR.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-202210?wid=970&hei=1020&fmt=png-alpha&.v=1664411207139",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-202210?wid=970&hei=1020&fmt=png-alpha&.v=1664411207139"
    ],
    storageOptions: ["128GB", "256GB", "512GB", "1TB", "2TB"],
    colorOptions: ["Space Gray", "Silver"],
    storage: "256GB",
    color: "Silver",
    stock: 12,
    countInStock: 12
  },
  {
    name: "MacBook Air 13-inch",
    model: "MacBook Air 13-inch",
    category: "macbook",
    series: "macbook-air",
    isFeatured: false,
    price: 1099,
    description: "Incredibly thin. Shockingly powerful. Built for everywhere.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-and-15-m2-select-202306-midnight?wid=640&hei=550&fmt=png-alpha&.v=1684281415942",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-and-15-m2-select-202306-midnight?wid=640&hei=550&fmt=png-alpha&.v=1684281415942"
    ],
    storageOptions: ["256GB", "512GB", "1TB"],
    colorOptions: ["Midnight", "Starlight", "Silver", "Space Gray"],
    storage: "256GB",
    color: "Midnight",
    stock: 14,
    countInStock: 14
  },
  {
    name: "MacBook Air 15-inch",
    model: "MacBook Air 15-inch",
    category: "macbook",
    series: "macbook-air",
    isFeatured: false,
    price: 1299,
    description: "A larger canvas. The same legendary Air performance.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-and-15-m2-select-202306-starlight?wid=640&hei=550&fmt=png-alpha&.v=1684281415952",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-and-15-m2-select-202306-starlight?wid=640&hei=550&fmt=png-alpha&.v=1684281415952"
    ],
    storageOptions: ["256GB", "512GB", "1TB"],
    colorOptions: ["Starlight", "Midnight", "Silver", "Space Gray"],
    storage: "256GB",
    color: "Starlight",
    stock: 10,
    countInStock: 10
  },
  {
    name: "MacBook Pro 14-inch",
    model: "MacBook Pro 14-inch",
    category: "macbook",
    series: "macbook-pro",
    isFeatured: false,
    price: 1599,
    description: "Pro power. Liquid Retina XDR. Ready for your best work.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-gallery1-202301?wid=5120&hei=2880&fmt=png-alpha",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-gallery1-202301?wid=5120&hei=2880&fmt=png-alpha"
    ],
    storageOptions: ["512GB", "1TB", "2TB"],
    colorOptions: ["Space Gray", "Silver", "Space Black"],
    storage: "512GB",
    color: "Space Gray",
    stock: 9,
    countInStock: 9
  },
  {
    name: "MacBook Pro 16-inch",
    model: "MacBook Pro 16-inch",
    category: "macbook",
    series: "macbook-pro",
    isFeatured: false,
    price: 2499,
    description: "Immersive display. Serious performance. Built for pro workflows.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-gallery1-202310?wid=5120&hei=2880&fmt=png-alpha",
    images: [
      "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spaceblack-gallery1-202310?wid=5120&hei=2880&fmt=png-alpha"
    ],
    storageOptions: ["512GB", "1TB", "2TB", "4TB"],
    colorOptions: ["Space Black", "Silver"],
    storage: "1TB",
    color: "Space Black",
    stock: 6,
    countInStock: 6
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products seeded");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();