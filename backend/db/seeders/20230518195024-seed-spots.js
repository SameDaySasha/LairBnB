'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');

let options = {};
options.tableName = 'Spots'
console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx spots async complete xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ')
    // console.log(`${Spots}`)
    return queryInterface.bulkInsert(
     options.tableName,
      [
        {
          ownerId: 1,
          address: "Dragon's Peak",
          city: 'Firehold',
          state: 'Volcania',
          country: 'Draconia',
          lat: 39.123,
          lng: 98.456,
          name: "Flamescale's Lair",
          description: `test`,
          price: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
          // previewImage: 'https://example.com/flamescale-lair.jpg',
        },
        {
          ownerId: 2,
          address: 'Dark Forest',
          city: 'Shadowdale',
          state: 'Gloomhaven',
          country: 'Ebonreach',
          lat: 22.789,
          lng: 57.321,
          name: "Shadowclaw's Den",
          description: `test`,
          price: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
          // previewImage: 'https://example.com/shadowclaw-den.jpg',
        },
        {
          ownerId: 3,
          address: 'Misty Peaks',
          city: 'Cloudhaven',
          state: 'Aetheria',
          country: 'Celestria',
          lat: 53.456,
          lng: 8.123,
          name: "Auroradus' Sanctuary",
          description: `test`,
          price: 600,
          createdAt: new Date(),
          updatedAt: new Date(),
          // previewImage: 'https://example.com/auroradus-sanctuary.jpg',
        },
        {
          ownerId: 4,
          address: 'Frozen Tundra',
          city: 'Icefang',
          state: 'Glacieria',
          country: 'Frosthold',
          lat: 67.890,
          lng: 35.678,
          name: "Frostbite's Domain",
          description: `test`,
          price: 550,
          createdAt: new Date(),
          updatedAt: new Date(),
          // previewImage: 'https://example.com/frostbites-domain.jpg',
        },
        {
          ownerId: 5,
          address: 'Halfling Hills',
          city: 'Shiretown',
          state: 'Halflingshire',
          country: 'Halfling Country',
          lat: 39.876,
          lng: 22.345,
          name: "Merrydale's Haven",
          description: `test`,
          price: 550,
          createdAt: new Date(),
          updatedAt: new Date(),
          // previewImage: 'https://example.com/merrydales-haven.jpg',
        },
        // {
        //   ownerId: 6,
        //   address: 'Misty Meadows',
        //   city: 'Whispering Pines',
        //   state: 'Enchanted Grove',
        //   country: 'Fairylandia',
        //   lat: 41.234,
        //   lng: -73.567,
        //   name: "Whispertwig's Enclave",
        //   description: `Welcome to Whispertwig's Enclave, a mystical retreat nestled in the enchanting Misty Meadows of Fairylandia. This ethereal haven offers an immersive experience amidst the shimmering landscapes and whispers of magical creatures that dwell within.
        //    Step into Whispertwig's Enclave and be embraced by the soft glow of luminescent mushrooms, guiding you through winding paths and hidden alcoves. The enchanting interior is adorned with delicate vines and vibrant flowers, creating a serene ambiance that invites tranquility and wonder.
        //    The retreat features a cozy fairy-sized bed, adorned with silk sheets woven from moonbeams, ensuring a restful slumber amidst the ethereal beauty. Step outside onto the balcony and marvel at the breathtaking views of the Misty Meadows, where iridescent dragonflies dance and unicorns graze in the moonlight.
        //    Embark on magical adventures as you explore the enchanted groves, discover secret fairy rings, and encounter elusive woodland spirits. Engage in whimsical activities in the retreat's dedicated fairy playground, where you can swing from flower petals and dance among the fireflies.
        //    Book your stay at Whispertwig's Enclave and immerse yourself in the enchantment of Fairylandia. Embrace the magic that surrounds you and create unforgettable memories in this whimsical sanctuary.
        //    Note: Guests are encouraged to bring their own fairy wings for a fully immersive experience.`,
        //   price: 450,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/whispertwigs-enclave.jpg',
        // },
        // {
        //   ownerId: 7,
        //   address: 'Mystic Marshes',
        //   city: 'Serene Haven',
        //   state: 'Ethereal Isle',
        //   country: 'Mystica',
        //   lat: 50.678,
        //   lng: -20.123,
        //   name: "Glimmermist's Refuge",
        //   description: `Welcome to Glimmermist's Refuge, a tranquil sanctuary nestled amidst the mysterious Mystic Marshes of Mystica. This ethereal retreat offers a serene escape amidst the enchanting landscapes and gentle whispers of ancient spirits that reside within.
        //    As you step into Glimmermist's Refuge, you'll be greeted by a delicate mist that dances along the marshy paths, guiding you towards the sanctuary's entrance. The interior is adorned with soft, flowing fabrics and iridescent crystals, casting a soothing glow that creates an atmosphere of serenity and harmony.
        //    The refuge features a dreamy sleeping nook, adorned with ethereal drapes that sway with the marsh's gentle breeze, offering a peaceful haven for rest and rejuvenation. Step outside onto the marshy terrace and immerse yourself in the tranquil beauty of Mystica, where luminescent will-o'-wisps light your path under the starry night sky.
        //    Embark on mystical adventures as you traverse the winding marsh trails, encounter mystical creatures, and unlock ancient secrets hidden within the mist. Engage in contemplative meditations in the refuge's serene meditation garden, where you can connect with the essence of Mystica.
        //    Book your stay at Glimmermist's Refuge and experience the serenity of this ethereal sanctuary. Surrender to the enchantment that surrounds you and create everlasting memories in this magical retreat.
        //    Note: Guests are encouraged to bring their own ethereal crystals for heightened spiritual experiences.`,
        //   price: 550,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/glimmermists-refuge.jpg',
        // },
        // {
        //   ownerId: 8,
        //   address: 'Sunny Shores',
        //   city: 'Seashell Bay',
        //   state: 'Tropical Paradise',
        //   country: 'Suntopia',
        //   lat: -25.678,
        //   lng: 150.123,
        //   name: "Seashell's Hideaway",
        //   description: `Welcome to Seashell's Hideaway, a tropical retreat nestled along the sun-kissed shores of Suntopia. This idyllic haven offers an oasis of relaxation amidst the palm-fringed beaches and soothing sounds of crashing waves.
        //    Step into Seashell's Hideaway and feel the warm sand beneath your feet as gentle sea breezes caress your skin. The interior is adorned with vibrant seashells and beach-inspired decor, evoking a sense of tranquility and coastal charm.
        //    The hideaway features a cozy hammock suspended between two swaying palm trees, inviting you to unwind and indulge in blissful moments of relaxation. Take a dip in the crystal-clear waters just steps away or bask in the golden rays of the sun on your private beachfront terrace.
        //    Embark on tropical adventures as you explore the pristine coral reefs, encounter playful dolphins, and indulge in water sports along the coastline. Savor the flavors of Suntopia in the hideaway's outdoor dining area, where you can feast on fresh seafood and sip on refreshing tropical cocktails.
        //    Book your stay at Seashell's Hideaway and immerse yourself in the laid-back paradise of Suntopia. Embrace the beauty of the tropical landscape and create cherished memories in this beachfront sanctuary.
        //    Note: Guests are encouraged to bring their own snorkeling gear for underwater explorations and beach essentials for sun-soaked adventures.`,
        //   price: 700,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/seashells-hideaway.jpg',
        // },
        // {
        //   ownerId: 9,
        //   address: 'Whispering Peaks',
        //   city: 'Mystic Valley',
        //   state: 'Ethereal Realm',
        //   country: 'Realmoria',
        //   lat: 38.901,
        //   lng: -77.456,
        //   name: "Moonshadow's Refuge",
        //   description: `Welcome to Moonshadow's Refuge, a serene retreat nestled amidst the mystical Whispering Peaks of Realmoria. This ethereal haven offers an enchanting escape amidst the tranquil landscapes and the soft whispers of ancient spirits that reside within.
        //    As you enter Moonshadow's Refuge, you'll be embraced by a gentle mist that weaves through the air, guiding you to the heart of the sanctuary. The interior is adorned with ethereal tapestries and delicate crystals, casting a serene glow that envelops the space in a soothing aura.
        //    The refuge features a cozy meditation nook, surrounded by lush greenery and adorned with sacred symbols, offering a peaceful sanctuary for reflection and connection. Step outside onto the balcony and witness the breathtaking vistas of the Whispering Peaks, where clouds dance among towering peaks and cascading waterfalls.
        //    Embark on mystical adventures as you explore the winding trails, encounter ancient guardians, and unlock the secrets of the ethereal realm. Engage in harmonious rituals in the refuge's sacred grove, where you can attune to the energies of the natural world.
        //    Book your stay at Moonshadow's Refuge and immerse yourself in the tranquility of this ethereal sanctuary. Embrace the whispers of magic that surround you and create everlasting memories in this mystical retreat.
        //    Note: Guests are encouraged to bring their own sacred artifacts for personal rituals and spiritual practices.`,
        //   price: 650,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/moonshadows-refuge.jpg',
        // },
        // {
        //   ownerId: 10,
        //   address: 'Emerald Valley',
        //   city: 'Fairyland',
        //   state: 'Enchanted Realm',
        //   country: 'Feytopia',
        //   lat: 42.345,
        //   lng: -71.890,
        //   name: "Glimmerleaf's Glade",
        //   description: `Welcome to Glimmerleaf's Glade, a magical retreat nestled within the lush Emerald Valley of Feytopia. This enchanting haven offers a whimsical escape amidst the vibrant landscapes and playful spirits that dwell within.
        //    Step into Glimmerleaf's Glade and be greeted by the gentle rustling of leaves and the sparkling sunlight filtering through the canopy. The interior is adorned with delicate fairy lights and colorful foliage, creating an atmosphere of enchantment and joy.
        //    The glade features a cozy treehouse, adorned with intricately carved wooden furniture and adorned with whimsical decorations, providing a magical sanctuary for relaxation and rejuvenation. Step outside onto the suspended bridge and immerse yourself in the beauty of the Emerald Valley, where mystical creatures frolic and ancient trees whisper tales of wonder.
        //    Embark on fantastical adventures as you explore hidden grottos, engage in playful encounters with woodland creatures, and participate in lively fairy dances. Join the fairies in their magical rituals and unlock the secrets of Feytopia's enchantment.
        //    Book your stay at Glimmerleaf's Glade and experience the wonder of this magical sanctuary. Embrace the playful spirit that surrounds you and create cherished memories in this whimsical retreat.
        //    Note: Guests are encouraged to bring their own fairy wings and musical instruments for immersive fairy festivities.`,
        //   price: 550,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/glimmerleafs-glade.jpg',
        // },
        // {
        //   ownerId: 11,
        //   address: 'Crimson Canyon',
        //   city: 'Bloodstone',
        //   state: 'Shadowlands',
        //   country: 'Darkoria',
        //   lat: 37.123,
        //   lng: -110.678,
        //   name: "Ravenshadow's Haven",
        //   description: `Welcome to Ravenshadow's Haven, a mysterious refuge nestled within the haunting Crimson Canyon of Darkoria. This secluded sanctuary offers an immersive experience amidst the rugged landscapes and whispers of ancient shadows that permeate the air.
        //    As you enter Ravenshadow's Haven, you'll be enveloped by an eerie mist that veils the surroundings, heightening the sense of intrigue and adventure. The interior is adorned with ornate gothic decor and flickering candlelight, casting haunting shadows on the stone walls.
        //    The haven features a cozy library nook, filled with ancient tomes and mystical artifacts, providing the perfect space for quiet contemplation and delving into the secrets of the shadowlands. Step outside onto the hidden terrace and witness the breathtaking views of Crimson Canyon, where shadows dance in the twilight and secrets lurk in every crevice.
        //    Embark on dark adventures as you explore hidden crypts, decipher arcane runes, and confront the mysteries of the shadowlands. Engage in esoteric rituals in the haven's dimly lit chamber, where you can tap into the power of the shadows and unlock hidden abilities.
        //    Book your stay at Ravenshadow's Haven and immerse yourself in the enigma of this shadowy sanctuary. Embrace the darkness that surrounds you and create unforgettable memories in this captivating retreat.
        //    Note: Guests are advised to bring their own black attire and an inquisitive mind for unraveling the secrets of the shadowlands.`,
        //   price: 500,
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        //   // previewImage: 'https://example.com/ravenshadows-haven.jpg',
        // }
        
      ],
      
    ),options;
  },

  down: async (queryInterface, Sequelize) => {
   
    return queryInterface.bulkDelete(options.tableName);
  },
};
