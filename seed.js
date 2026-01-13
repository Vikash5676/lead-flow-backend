const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Lead = require('./models/Lead');
const Chat = require('./models/Chat');
const Call = require('./models/Call');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ledfo-crm', options);
    console.log('✅ MongoDB Atlas Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
};

const clearDatabase = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      process.exit(1);
    }

    console.log('\n⚠️  WARNING: This will DELETE ALL DATA from database!\n');
    console.log('📊 Current database stats:');

    const userCount = await User.countDocuments();
    const leadCount = await Lead.countDocuments();
    const chatCount = await Chat.countDocuments();
    const callCount = await Call.countDocuments();

    console.log(`   Users: ${userCount}`);
    console.log(`   Leads: ${leadCount}`);
    console.log(`   Chats: ${chatCount}`);
    console.log(`   Calls: ${callCount}\n`);

    if (process.argv.includes('--force') || process.argv.includes('-f')) {
      console.log('🗑️  Clearing all data from database...\n');

      await User.deleteMany({});
      console.log('   ✅ Cleared users');

      await Lead.deleteMany({});
      console.log('   ✅ Cleared leads');

      await Chat.deleteMany({});
      console.log('   ✅ Cleared chats');

      await Call.deleteMany({});
      console.log('   ✅ Cleared calls');

      console.log('\n🎉 Database cleared successfully!\n');
      console.log('💡 You can now run "npm run seed" to populate with fresh data.\n');
    } else {
      console.log('💡 Use --force or -f flag to confirm:\n');
      console.log('   npm run clear:db --force\n');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    console.error('Stack trace:', error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    const connected = await connectDB();
    if (!connected) {
      process.exit(1);
    }

    console.log('\n🌱 Starting database seeding...\n');

    const userCount = await User.countDocuments();
    const leadCount = await Lead.countDocuments();
    const chatCount = await Chat.countDocuments();
    const callCount = await Call.countDocuments();

    console.log(`📊 Current database stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Leads: ${leadCount}`);
    console.log(`   Chats: ${chatCount}`);
    console.log(`   Calls: ${callCount}\n`);

    // Check if we have minimum data to consider database seeded
    const isDatabaseSeeded = userCount >= 2 && leadCount > 0;

    if (isDatabaseSeeded) {
      console.log('⚠️  Database appears to be already seeded.');
      console.log('💡 To force re-seeding, run:');
      console.log('   npm run seed:force');
      console.log('\n💡 Or use SEED_DATABASE=true environment variable to auto-seed on server start.\n');
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log('🗑️  Clearing any existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Chat.deleteMany({});
    await Call.deleteMany({});

    console.log('✅ Cleared existing data\n');

    // ========================================
    // SEED USERS
    // ========================================
    console.log('👤 Creating users...');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const users = [
      {
        name: 'Admin User',
        email: 'admin@leadflow.com',
        password: adminPassword,
        role: 'super_admin',
        status: 'active',
        lastLogin: new Date()
      },
      {
        name: 'Test User',
        email: 'user@leadflow.com',
        password: userPassword,
        role: 'authorized_user',
        status: 'active',
        lastLogin: new Date()
      },
      {
        name: 'Pending User',
        email: 'pending@leadflow.com',
        password: userPassword,
        role: 'pending_user',
        status: 'pending',
        lastLogin: null
      },
      {
        name: 'Sales Manager',
        email: 'sales@leadflow.com',
        password: userPassword,
        role: 'authorized_user',
        status: 'active',
        lastLogin: new Date(Date.now() - 86400000)
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`   ✅ Created ${createdUsers.length} users`);

    // ========================================
    // SEED LEADS
    // ========================================
    console.log('📋 Creating leads...');

    const leads = [
      {
        name: 'Rahul Sharma',
        phone: '917060175427',
        email: 'rahul.sharma@email.com',
        source: 'call',
        status: 'hot',
        notes: 'Interested in South Delhi property. Budget 50 lakhs. Site visit scheduled.',
        lastContact: new Date(),
        createdAt: new Date()
      },
      {
        name: 'Priya Patel',
        phone: '918765432109',
        email: 'priya.patel@email.com',
        source: 'call',
        status: 'hot',
        notes: 'Looking for commercial space in Gurgaon Cyber City. Budget 2.5 crores.',
        lastContact: new Date(Date.now() - 3600000),
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        name: 'Amit Kumar',
        phone: '919876543210',
        email: 'amit.kumar@email.com',
        source: 'whatsapp',
        status: 'warm',
        notes: 'Inquiring about residential plots in Noida Expressway. Budget 1.5 crores.',
        lastContact: new Date(Date.now() - 7200000),
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        name: 'Sneha Verma',
        phone: '919001234567',
        email: 'sneha.verma@email.com',
        source: 'call',
        status: 'warm',
        notes: 'Interested in luxury apartment in DLF Phase 5. Budget up to 4 crores.',
        lastContact: new Date(Date.now() - 10800000),
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        name: 'Vikram Singh',
        phone: '919876123456',
        email: 'vikram.singh@email.com',
        source: 'whatsapp',
        status: 'cold',
        notes: 'Looking for investment property in Faridabad. Budget 60-70 lakhs.',
        lastContact: new Date(Date.now() - 86400000),
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        name: 'Neha Gupta',
        phone: '917890123456',
        email: 'neha.gupta@email.com',
        source: 'call',
        status: 'hot',
        notes: 'First-time home buyer. 2BHK in Indirapuram. Budget 85 lakhs.',
        lastContact: new Date(Date.now() - 172800000),
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        name: 'Rajesh Malhotra',
        phone: '919234567890',
        email: 'rajesh.malhotra@email.com',
        source: 'whatsapp',
        status: 'warm',
        notes: 'NRI client looking for penthouse in Dwarka. Budget 6 crores.',
        lastContact: new Date(Date.now() - 259200000),
        createdAt: new Date(Date.now() - 259200000)
      },
      {
        name: 'Deepak Joshi',
        phone: '918345678901',
        email: 'deepak.joshi@email.com',
        source: 'call',
        status: 'warm',
        notes: 'Looking for warehouse in Bhiwandi, Mumbai. Budget 2 crores.',
        lastContact: new Date(Date.now() - 345600000),
        createdAt: new Date(Date.now() - 345600000)
      },
      {
        name: 'Kavita Mehta',
        phone: '917890234567',
        email: 'kavita.mehta@email.com',
        source: 'whatsapp',
        status: 'cold',
        notes: 'Inquiring about retirement home in Dehradun. Budget 1.5 crores.',
        lastContact: new Date(Date.now() - 432000000),
        createdAt: new Date(Date.now() - 432000000)
      },
      {
        name: 'Sanjay Kapoor',
        phone: '919567890123',
        email: 'sanjay.kapoor@email.com',
        source: 'call',
        status: 'warm',
        notes: 'Investor looking for retail space in Connaught Place. Budget 3 crores.',
        lastContact: new Date(Date.now() - 518400000),
        createdAt: new Date(Date.now() - 518400000)
      },
      {
        name: 'Anita Desai',
        phone: '918901234567',
        email: 'anita.desai@email.com',
        source: 'whatsapp',
        status: 'hot',
        notes: 'Looking for 1BHK for daughter. Vaishali. Budget 45-50 lakhs.',
        lastContact: new Date(Date.now() - 604800000),
        createdAt: new Date(Date.now() - 604800000)
      },
      {
        name: 'Mahesh Reddy',
        phone: '919012345678',
        email: 'mahesh.reddy@email.com',
        source: 'call',
        status: 'warm',
        notes: 'Looking for warehouse in Bhiwandi. 5000 sq ft. Budget 2.5 crores.',
        lastContact: new Date(Date.now() - 691200000),
        createdAt: new Date(Date.now() - 691200000)
      }
    ];

    const createdLeads = await Lead.insertMany(leads);
    console.log(`   ✅ Created ${createdLeads.length} leads`);

    // Create lead ID map for linking chats and calls
    const leadMap = {};
    createdLeads.forEach(lead => {
      leadMap[lead.phone] = lead._id;
    });

    // ========================================
    // SEED CHATS
    // ========================================
    console.log('💬 Creating chats...');

    const chats = [
      // WhatsApp conversation 1 - 917060175427
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'Hi, I am interested in the property',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'Hello! Thank you for your interest. Which property are you looking at?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 3500000)
      },
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'The one in South Delhi, 5BHK',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 3400000)
      },
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'Great! The South Delhi property has 3 BHK available. Would you like to schedule a site visit?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 3300000)
      },
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'Yes, tomorrow at 2 PM works for me',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 3200000)
      },
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        message: 'Perfect! I will confirm the visit with the sales team. See you tomorrow!',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 3100000)
      },

      // WhatsApp conversation 2 - 918765432109
      {
        phoneNumber: '918765432109',
        contactName: 'Priya Patel',
        message: 'Hello, I want to see commercial space in Gurgaon',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        phoneNumber: '918765432109',
        contactName: 'Priya Patel',
        message: 'Hi Priya! We have excellent commercial spaces in Cyber City. What are your requirements?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 7100000)
      },
      {
        phoneNumber: '918765432109',
        contactName: 'Priya Patel',
        message: 'Need 500 sq ft, budget around 2.5 crores',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 7000000)
      },
      {
        phoneNumber: '918765432109',
        contactName: 'Priya Patel',
        message: 'Perfect! I will send you the property listings shortly. When can you visit?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 6900000)
      },

      // WhatsApp conversation 3 - 919876543210
      {
        phoneNumber: '919876543210',
        contactName: 'Amit Kumar',
        message: 'Hi, looking for plots in Noida',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        phoneNumber: '919876543210',
        contactName: 'Amit Kumar',
        message: 'Hello Amit! We have plots available on Noida Expressway. Size preference?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 10700000)
      },
      {
        phoneNumber: '919876543210',
        contactName: 'Amit Kumar',
        message: '300 sq yards, budget 1.5 crores',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 10600000)
      },
      {
        phoneNumber: '919876543210',
        contactName: 'Amit Kumar',
        message: 'Great! 300 sq yards plots are available. I will share the details and price list.',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 10500000)
      },

      // WhatsApp conversation 4 - 919001234567
      {
        phoneNumber: '919001234567',
        contactName: 'Sneha Verma',
        message: 'Show me luxury apartments in DLF Phase 5',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 14400000)
      },
      {
        phoneNumber: '919001234567',
        contactName: 'Sneha Verma',
        message: 'Hi Sneha! We have premium 4 BHK apartments with servant rooms. Budget?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 14300000)
      },
      {
        phoneNumber: '919001234567',
        contactName: 'Sneha Verma',
        message: 'Budget up to 4 crores',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 14200000)
      },
      {
        phoneNumber: '919001234567',
        contactName: 'Sneha Verma',
        message: 'Excellent! Within your budget, we have 2-3 options. Would you like to schedule a visit this weekend?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 14100000)
      },

      // WhatsApp conversation 5 - 919876123456
      {
        phoneNumber: '919876123456',
        contactName: 'Vikram Singh',
        message: 'Investment properties in Faridabad',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 18000000)
      },
      {
        phoneNumber: '919876123456',
        contactName: 'Vikram Singh',
        message: 'Hello! We have several investment options in Faridabad. What is your budget?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 17900000)
      },
      {
        phoneNumber: '919876123456',
        contactName: 'Vikram Singh',
        message: 'Looking for 2BHK, 60-70 lakhs',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 17800000)
      },
      {
        phoneNumber: '919876123456',
        contactName: 'Vikram Singh',
        message: 'Perfect! We have 2 BHK under construction projects with excellent ROI. Sharing details now.',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 17700000)
      },

      // WhatsApp conversation 6 - 917890123456
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'I am a first time buyer, looking for 2BHK',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 21600000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'Congratulations on your first home! Where would you like to buy?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 21500000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'Indirapuram, near metro',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 21400000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'Great choice! Indirapuram has excellent connectivity. Budget range?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 21300000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'Around 85 lakhs, also need loan assistance',
        direction: 'incoming',
        read: true,
        createdAt: new Date(Date.now() - 21200000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        message: 'Perfect! Our loan advisor will help you. I will schedule a meeting. Any preferred time?',
        direction: 'outgoing',
        read: true,
        createdAt: new Date(Date.now() - 21100000)
      }
    ];

    // Link leadIds to chats
    const chatsWithLeads = chats.map(chat => ({
      ...chat,
      leadId: leadMap[chat.phoneNumber] || null
    }));

    const createdChats = await Chat.insertMany(chatsWithLeads);
    console.log(`   ✅ Created ${createdChats.length} chat messages`);

    // ========================================
    // SEED CALLS
    // ========================================
    console.log('📞 Creating calls...');

    const calls = [
      {
        phoneNumber: '917060175427',
        contactName: 'Rahul Sharma',
        direction: 'incoming',
        duration: 195,
        cost: 0.41,
        status: 'completed',
        notes: 'Interested in South Delhi property. 5 BHK requested. Budget 50 lakhs. Site visit scheduled for tomorrow at 2 PM. Very interested.',
        leadId: leadMap['917060175427'] || null,
        createdAt: new Date()
      },
      {
        phoneNumber: '918765432109',
        contactName: 'Priya Patel',
        direction: 'incoming',
        duration: 330,
        cost: 0.62,
        status: 'completed',
        notes: 'Looking for commercial space in Gurgaon Cyber City. 500 sq ft required. Budget 2.5 crores. Payment plans discussed. Will visit this weekend.',
        leadId: leadMap['918765432109'] || null,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        phoneNumber: '919876543210',
        contactName: 'Amit Kumar',
        direction: 'incoming',
        duration: 252,
        cost: 0.51,
        status: 'completed',
        notes: 'Inquiring about residential plots in Noida Expressway. 300 sq yards. Budget 1.5 crores. Needs information about registry and payment schedule. Will call back next week.',
        leadId: leadMap['919876543210'] || null,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        phoneNumber: '919001234567',
        contactName: 'Sneha Verma',
        direction: 'incoming',
        duration: 366,
        cost: 0.79,
        status: 'completed',
        notes: 'Interested in luxury apartment in DLF Phase 5, Gurgaon. 4 BHK with servant room. Budget up to 4 crores. Discussed amenities and metro connectivity. Impressed but needs to discuss with spouse.',
        leadId: leadMap['919001234567'] || null,
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        phoneNumber: '919876123456',
        contactName: 'Vikram Singh',
        direction: 'incoming',
        duration: 210,
        cost: 0.45,
        status: 'completed',
        notes: 'Looking for investment property in Faridabad. 2 BHK under construction. Budget 60-70 lakhs. Interested in payment-linked installments. Considering options.',
        leadId: leadMap['919876123456'] || null,
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        phoneNumber: '917890123456',
        contactName: 'Neha Gupta',
        direction: 'incoming',
        duration: 300,
        cost: 0.68,
        status: 'completed',
        notes: 'First-time home buyer looking for 2 BHK in Indirapuram. Budget up to 85 lakhs. Near metro preferred. Needs loan assistance. Discussed loan eligibility and EMI options. Scheduled loan advisor meeting next week.',
        leadId: leadMap['917890123456'] || null,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        phoneNumber: '919234567890',
        contactName: 'Rajesh Malhotra',
        direction: 'incoming',
        duration: 432,
        cost: 0.86,
        status: 'completed',
        notes: 'Looking for penthouse in Dwarka, Delhi. 5 BHK with terrace. Budget up to 6 crores. Client is NRI, needs virtual tour options. Discussed video call facility and documentation process.',
        leadId: leadMap['919234567890'] || null,
        createdAt: new Date(Date.now() - 259200000)
      },
      {
        phoneNumber: '918345678901',
        contactName: 'Deepak Joshi',
        direction: 'incoming',
        duration: 288,
        cost: 0.57,
        status: 'completed',
        notes: 'Looking for commercial showroom on main road in Greater Noida. Minimum 2000 sq ft. Budget 2 crores. Client wants high footfall location. Discussed rental potential. Will send location analysis.',
        leadId: leadMap['918345678901'] || null,
        createdAt: new Date(Date.now() - 345600000)
      },
      {
        phoneNumber: '917890234567',
        contactName: 'Kavita Mehta',
        direction: 'incoming',
        duration: 180,
        cost: 0.42,
        status: 'completed',
        notes: 'Inquiring about retirement home in Dehradun. 3 BHK with garden view. Budget 1.5 crores. Planning for next 2 years. Discussed upcoming projects. Will visit family in Dehradun next month for site visit.',
        leadId: leadMap['917890234567'] || null,
        createdAt: new Date(Date.now() - 432000000)
      },
      {
        phoneNumber: '919567890123',
        contactName: 'Sanjay Kapoor',
        direction: 'incoming',
        duration: 390,
        cost: 0.73,
        status: 'completed',
        notes: 'Looking for retail space in Connaught Place, Delhi. 500 sq ft on ground floor. Budget up to 3 crores. Investor looking for rental income. Discussed market rates and ROI. Comparing with other options.',
        leadId: leadMap['919567890123'] || null,
        createdAt: new Date(Date.now() - 518400000)
      },
      {
        phoneNumber: '918901234567',
        contactName: 'Anita Desai',
        direction: 'incoming',
        duration: 150,
        cost: 0.39,
        status: 'completed',
        notes: 'Interested in 1 BHK in Vaishali, Ghaziabad for daughter college. Budget 45-50 lakhs. Near Metro. Discussed ready-to-move options. Site visit scheduled for weekend.',
        leadId: leadMap['918901234567'] || null,
        createdAt: new Date(Date.now() - 604800000)
      },
      {
        phoneNumber: '919012345678',
        contactName: 'Mahesh Reddy',
        direction: 'incoming',
        duration: 312,
        cost: 0.65,
        status: 'completed',
        notes: 'Looking for warehouse space in Bhiwandi, Mumbai. 5000 sq ft minimum. Budget up to 2.5 crores. Client needs high ceiling and loading dock. Discussed available industrial zones and connectivity. Will send specifications.',
        leadId: leadMap['919012345678'] || null,
        createdAt: new Date(Date.now() - 691200000)
      }
    ];

    const createdCalls = await Call.insertMany(calls);
    console.log(`   ✅ Created ${createdCalls.length} calls`);

    // ========================================
    // COMPLETE
    // ========================================
    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Login credentials:');
    console.log('   👑 Super Admin: admin@leadflow.com / admin123');
    console.log('   👤 Test User: user@leadflow.com / user123');
    console.log('   ⏳ Pending User: pending@leadflow.com / user123');
    console.log('\n🌐 Frontend: http://localhost:3000');
    console.log('⚙️  Backend API: http://localhost:5000\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack trace:', error.stack);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Wrapper function to handle force reseed
const forceReseed = async () => {
  console.log('🔄 Force reseed mode: Clearing database first...\n');
  const connected = await connectDB();
  if (connected) {
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Chat.deleteMany({});
    await Call.deleteMany({});
    console.log('✅ Database cleared\n');
    await mongoose.connection.close();
    console.log('🌱 Starting fresh seed...\n');
    seedDatabase();
  } else {
    process.exit(1);
  }
};

// Run based on command
const command = process.argv[2];

if (command === 'clear') {
  clearDatabase();
} else if (command === 'force') {
  forceReseed();
} else if (command === 'seed') {
  seedDatabase();
} else {
  seedDatabase();
}

module.exports = { seedDatabase, clearDatabase };
