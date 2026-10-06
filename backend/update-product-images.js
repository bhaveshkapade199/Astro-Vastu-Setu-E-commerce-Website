// Smart image assignment - matches bracelet images based on product name
const mongoose = require('mongoose');
require('dotenv').config();

const Product = mongoose.model('Product', new mongoose.Schema({id:Number,name:String,image:String},{strict:false}));

function getImageForProduct(name, currentImage) {
  const n = name.toLowerCase();
  if (n.includes('7 chakra') || n.includes('seven chakra') || n.includes('chakra')) return '/uploads/bracelet-7chakra.jpeg';
  if (n.includes('amethyst')) return '/uploads/bracelet-amethyst.jpeg';
  if (n.includes('citrine')) return '/uploads/bracelet-citrine.jpeg';
  if (n.includes('tiger eye') || n.includes('tigereye')) return '/uploads/bracelet-tigereye.jpeg';
  if (n.includes('black tourmaline') || n.includes('tourmaline')) return '/uploads/bracelet-blacktourmaline.jpeg';
  if (n.includes('rose quartz')) return '/uploads/bracelet-rosequartz.jpeg';
  if (n.includes('clear quartz') || n.includes('quartz')) return '/uploads/bracelet-clearquartz.jpeg';
  if (n.includes('pyrite')) return '/uploads/bracelet-pyrite.jpeg';
  if (n.includes('green aventurine') || n.includes('aventurine')) return '/uploads/bracelet-greenaventurine.jpeg';
  if (n.includes('rudraksha')) return '/uploads/bracelet-rudraksha.jpeg';
  if (n.includes('dhanyog') || n.includes('dhan')) return '/uploads/bracelet-dhanyog.jpeg';
  if (n.includes('lakshmi') || n.includes('potli')) return '/uploads/bracelet-lakshmipotli.jpeg';
  // If admin already uploaded a custom image, keep it
  if (currentImage && currentImage.startsWith('/uploads/prod-')) return currentImage;
  return '/uploads/bracelet-default.jpeg';
}

mongoose.connect('mongodb://127.0.0.1:27017/astrovastosetu').then(async () => {
  const prods = await Product.find().sort({id: 1});
  for (const p of prods) {
    const newImg = getImageForProduct(p.name, p.image);
    await Product.updateOne({id: p.id}, {$set: {image: newImg}});
    console.log('ID:' + p.id + ' | ' + p.name + ' -> ' + newImg);
  }
  console.log('\nAll images updated successfully!');
  process.exit(0);
}).catch(e => { 
  console.error('Error:', e.message); 
  process.exit(1); 
});
