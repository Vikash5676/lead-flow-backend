// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const connectDB = require('./config/db');
// const errorHandler = require('./middleware/errorHandler');

// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const leadRoutes = require('./routes/leadRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const callRoutes = require('./routes/callRoutes');

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/leads', leadRoutes);
// app.use('/api/chats', chatRoutes);
// app.use('/api/calls', callRoutes);

// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'LeadFlow-CRM API',
//     version: '1.0.0',
//     status: 'running'
//   });
// });

// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
//   console.log(`⚙️  MongoDB URI: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
//   console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'NOT SET - AUTH WILL FAIL!'}`);
//   console.log(`🌐 API: http://localhost:${PORT}`);

//   // Auto-seed database if enabled
//   if (process.env.SEED_DATABASE === 'true') {
//     console.log('\n🌱 SEED_DATABASE is enabled. Running seed...');
//     console.log('💡 You can also manually run: npm run seed');
//     console.log('');
//     // Note: For auto-seeding, run it in a separate process or after server starts
//     // This prevents the top-level await issue
//     const { exec } = require('child_process');
//     exec('node seed.js seed', (error, stdout, stderr) => {
//       if (error) {
//         console.error('Error auto-seeding:', error);
//       } else {
//         console.log(stdout);
//       }
//       if (stderr) {
//         console.error('Seed errors:', stderr);
//       }
//     });
//   } else {
//     console.log('\n💡 To seed database with dummy data, run:');
//     console.log('   npm run seed');
//     console.log('   or set SEED_DATABASE=true in .env and restart server\n');
//     console.log('\n🧪 Test endpoints:');
//     console.log('   POST http://localhost:5000/api/auth/test-auth - Test authentication');
//     console.log('   GET  http://localhost:5000/api/auth/test-db - Check database (requires auth)');
//     console.log('   GET  http://localhost:5000/api/leads/stats - Check leads stats (requires auth)');
//     console.log('   GET  http://localhost:5000/api/calls/stats - Check calls stats (requires auth)');
//     console.log('');
//   }
// });
//   } else {
//     console.log('\n💡 To seed database with dummy data, run:');
//     console.log('   npm run seed');
//     console.log('   or set SEED_DATABASE=true in .env and restart server\n');
//   }
// });

// // Handle graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM signal received: closing HTTP server');
//   server.close(() => {
//     console.log('HTTP server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });

// process.on('SIGINT', () => {
//   console.log('\nSIGINT signal received: closing HTTP server');
//   server.close(() => {
//     console.log('HTTP server closed');
//     mongoose.connection.close(false, () => {
//       console.log('MongoDB connection closed');
//       process.exit(0);
//     });
//   });
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leadRoutes = require('./routes/leadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const callRoutes = require('./routes/callRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/calls', callRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'LeadFlow-CRM API',
    version: '1.0.0',
    status: 'running'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`⚙️  MongoDB URI: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
  console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'NOT SET - AUTH WILL FAIL!'}`);
  console.log(`🌐 API: http://localhost:${PORT}`);

  // Auto-seed database if enabled
  if (process.env.SEED_DATABASE === 'true') {
    console.log('\n🌱 SEED_DATABASE is enabled. Running seed...');
    console.log('💡 You can also manually run: npm run seed\n');

    const { exec } = require('child_process');
    exec('node seed.js seed', (error, stdout, stderr) => {
      if (error) {
        console.error('Error auto-seeding:', error);
      }
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error('Seed errors:', stderr);
      }
    });
  } else {
    console.log('\n💡 To seed database with dummy data, run:');
    console.log('   npm run seed');
    console.log('   or set SEED_DATABASE=true in .env and restart server\n');
    console.log('\n🧪 Test endpoints:');
    console.log('   POST http://localhost:5000/api/auth/test-auth');
    console.log('   GET  http://localhost:5000/api/auth/test-db');
    console.log('   GET  http://localhost:5000/api/leads/stats');
    console.log('   GET  http://localhost:5000/api/calls/stats\n');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
