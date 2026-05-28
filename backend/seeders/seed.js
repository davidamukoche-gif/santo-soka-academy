require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sequelize, User, Unit, Tenant, Payment, MaintenanceRequest, Feedback } = require('../models');

const unitTypes = ['bedsitter', '1bedroom', '2bedroom'];
const rentPrices = { bedsitter: 8000, '1bedroom': 12000, '2bedroom': 18000 };
const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const tenantNames = [
  'James Mwangi', 'Mary Wanjiku', 'Peter Ochieng', 'Grace Akinyi', 'John Kamau',
  'Faith Njeri', 'David Otieno', 'Agnes Wambui', 'Samuel Kipchoge', 'Lucy Muthoni',
  'Michael Omondi', 'Sarah Njoroge', 'Joseph Kipruto', 'Elizabeth Wairimu', 'Daniel Wekesa',
  'Esther Auma', 'Robert Mutua', 'Catherine Chebet', 'Patrick Maina', 'Jane Adhiambo',
  'Anthony Njenga', 'Rose Kemunto', 'Charles Ogutu', 'Alice Wangari', 'George Kiptoo',
  'Margaret Akoth', 'Francis Ngugi', 'Beatrice Chepkorir', 'Stephen Onyango', 'Dorothy Nyambura',
  'Thomas Karanja', 'Mercy Achieng', 'Paul Kosgei', 'Irene Mwikali', 'Emmanuel Simiyu',
  'Joyce Mumbi', 'Andrew Githae', 'Pauline Naliaka', 'Dennis Rotich', 'Lilian Nyokabi',
  'Brian Wamalwa', 'Nancy Wawira', 'Kevin Musyoka', 'Caroline Jeptoo', 'Martin Barasa',
  'Winnie Moraa', 'Philip Ndung\'u', 'Gladys Cherono', 'Simon Odongo', 'Monica Nduta',
  'Victor Letting', 'Zipporah Makena', 'Henry Ombati', 'Eunice Chelagat', 'Alex Wafula',
  'Doris Nyakerario', 'Frederick Muriuki', 'Ann Jepchumba', 'Nicholas Oloo', 'Edith Wangeci',
  'Eric Langat', 'Juliet Aoko', 'Isaac Macharia', 'Christine Jepngetich', 'Gilbert Wanyama',
  'Evelyn Nyawira', 'Ronald Kimani', 'Millicent Abong\'o', 'Amos Chesire', 'Rebecca Mwende',
  'Oscar Otiende', 'Hannah Waceke', 'Timothy Kirui', 'Ruth Nyangweso', 'Collins Mwanga',
  'Phoebe Nyaboke', 'Jeff Nzomo', 'Naomi Chelang\'at', 'Adrian Ouma', 'Tabitha Wanjiru',
  'Leon Kipngetich', 'Gloria Akumu', 'Kenneth Wainaina', 'Pamela Rono', 'Vincent Muturi',
  'Cynthia Njeeri', 'Raymond Odhiambo', 'Salome Mwendwa', 'Joshua Toroitich', 'Angela Wamaitha',
  'Clinton Bett', 'Priscilla Nyamai', 'Edwin Munyao', 'Diana Cheruiyot', 'Mark Wasike',
  'Charity Mukami', 'Allan Kiprop', 'Mercy Wangui', 'Derrick Onyambu', 'Stella Jelagat',
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (force)');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@rentflow.co.ke',
      password: 'admin123',
      role: 'admin',
      phone: '0700000001',
    });

    const caretaker = await User.create({
      name: 'Caretaker Ouma',
      email: 'caretaker@rentflow.co.ke',
      password: 'caretaker123',
      role: 'caretaker',
      phone: '0700000002',
    });

    console.log('Admin and caretaker created');

    const units = [];
    let unitIndex = 0;
    for (let b = 0; b < blocks.length; b++) {
      const block = blocks[b];
      const unitsPerBlock = 30;
      for (let floor = 1; floor <= 6; floor++) {
        for (let room = 1; room <= 5; room++) {
          unitIndex++;
          if (unitIndex > 210) break;

          const typeIndex = (unitIndex - 1) % 3;
          const unitType = unitTypes[typeIndex];
          const unitNumber = `${block}${floor}${String(room).padStart(2, '0')}`;

          const unit = await Unit.create({
            unitNumber,
            floor: `Floor ${floor}`,
            block: `Block ${block}`,
            unitType,
            rentAmount: rentPrices[unitType],
            status: 'vacant',
            utilityMeterElectricity: `E-${unitNumber}`,
            utilityMeterWater: `W-${unitNumber}`,
          });
          units.push(unit);
        }
      }
      if (unitIndex > 210) break;
    }

    console.log(`${units.length} units created`);

    const numTenants = Math.min(tenantNames.length, 100);
    const tenants = [];

    for (let i = 0; i < numTenants; i++) {
      const name = tenantNames[i];
      const emailName = name.toLowerCase().replace(/[^a-z ]/g, '').replace(/ /g, '.');
      const user = await User.create({
        name,
        email: `${emailName}@email.com`,
        password: 'tenant123',
        role: 'tenant',
        phone: `07${String(10000000 + i).slice(-8)}`,
      });

      const leaseStart = new Date(2024, Math.floor(Math.random() * 12), 1);
      const leaseEnd = new Date(leaseStart);
      leaseEnd.setFullYear(leaseEnd.getFullYear() + 1);

      const tenant = await Tenant.create({
        userId: user.id,
        nationalId: `${20000000 + i * 137}`,
        leaseStart: leaseStart.toISOString().split('T')[0],
        leaseEnd: leaseEnd.toISOString().split('T')[0],
        deposit: units[i].rentAmount,
        emergencyContact: `Emergency Contact ${i + 1}`,
        emergencyContactPhone: `07${String(20000000 + i).slice(-8)}`,
        status: 'active',
      });

      units[i].tenantId = tenant.id;
      units[i].status = 'occupied';
      await units[i].save();

      tenants.push(tenant);
    }

    console.log(`${tenants.length} tenants created and assigned to units`);

    const months = ['January', 'February', 'March', 'April', 'May'];
    const paymentMethods = ['mpesa', 'bank', 'cash'];

    for (const month of months) {
      const monthIndex = months.indexOf(month);
      for (let i = 0; i < tenants.length; i++) {
        const tenant = tenants[i];
        const unit = units[i];
        const rentAmount = parseFloat(unit.rentAmount);

        const rand = Math.random();
        let amount, status;
        if (rand < 0.7) {
          amount = rentAmount;
          status = 'paid';
        } else if (rand < 0.9) {
          amount = Math.floor(rentAmount * (0.3 + Math.random() * 0.5));
          status = 'partial';
        } else {
          continue;
        }

        await Payment.create({
          tenantId: tenant.id,
          unitId: unit.id,
          amount,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          transactionCode: `TXN${Date.now()}${i}${monthIndex}`,
          paymentDate: `2026-${String(monthIndex + 1).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
          month,
          year: 2026,
          status,
          balance: status === 'paid' ? 0 : rentAmount - amount,
        });
      }
    }

    console.log('Payments seeded');

    const maintenanceCategories = ['plumbing', 'electricity', 'broken_door_window', 'noise', 'water', 'internet', 'other'];
    const priorities = ['low', 'medium', 'high'];
    const statuses = ['open', 'in_progress', 'completed'];

    for (let i = 0; i < 25; i++) {
      const tenant = tenants[Math.floor(Math.random() * tenants.length)];
      const unit = units.find(u => u.tenantId === tenant.id);

      await MaintenanceRequest.create({
        tenantId: tenant.id,
        unitId: unit?.id,
        title: `Maintenance Issue #${i + 1}`,
        description: `Description for maintenance issue #${i + 1}. This needs attention.`,
        category: maintenanceCategories[Math.floor(Math.random() * maintenanceCategories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    console.log('Maintenance requests seeded');

    const feedbackCategories = ['security', 'cleanliness', 'water', 'noise', 'staff_behavior', 'general'];
    const feedbackStatuses = ['pending', 'reviewed', 'resolved'];

    for (let i = 0; i < 15; i++) {
      const tenant = tenants[Math.floor(Math.random() * tenants.length)];
      await Feedback.create({
        tenantId: tenant.id,
        category: feedbackCategories[Math.floor(Math.random() * feedbackCategories.length)],
        message: `Feedback message #${i + 1}. This is a sample tenant feedback.`,
        rating: Math.floor(Math.random() * 5) + 1,
        status: feedbackStatuses[Math.floor(Math.random() * feedbackStatuses.length)],
      });
    }

    console.log('Feedback seeded');
    console.log('\n--- Seed Complete ---');
    console.log('Admin login: admin@rentflow.co.ke / admin123');
    console.log('Caretaker login: caretaker@rentflow.co.ke / caretaker123');
    console.log('Tenant login: james.mwangi@email.com / tenant123');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
