import User from '../models/User.js';
import Application from '../models/Application.js';

export const DEMO_EMAIL = 'demo@demo.com';
export const DEMO_PASSWORD = 'demo1234';

// Realistic spread across all 8 statuses so the Kanban board and dashboard
// charts look populated for recruiters viewing the demo.
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

const SAMPLE_APPLICATIONS = [
  { company: 'Notion',  role: 'Software Engineer',          status: 'wishlist'                                              },
  { company: 'Vercel',  role: 'Frontend Engineer',          status: 'applied',      appliedDate: daysFromNow(-12)            },
  { company: 'Linear',  role: 'Product Engineer',           status: 'phone_screen', appliedDate: daysFromNow(-9)             },
  { company: 'Google',  role: 'Senior Frontend Engineer',   status: 'technical',    appliedDate: daysFromNow(-15), deadline: daysFromNow(3) },
  { company: 'Stripe',  role: 'Full Stack Developer',       status: 'final_round',  appliedDate: daysFromNow(-20), deadline: daysFromNow(5) },
  { company: 'Netflix', role: 'Backend Engineer',           status: 'offer',        appliedDate: daysFromNow(-25)            },
  { company: 'Airbnb',  role: 'Frontend Engineer',          status: 'rejected',     appliedDate: daysFromNow(-30)            },
  { company: 'Figma',   role: 'Senior Software Engineer',   status: 'withdrawn',    appliedDate: daysFromNow(-18)            },
];

/**
 * Ensures a permanent demo account (no expiresAt, so the TTL monitor never
 * deletes it) exists with sample data. Idempotent — safe to call on every boot.
 */
export async function seedDemo() {
  try {
    let demo = await User.findOne({ email: DEMO_EMAIL });
    if (!demo) {
      demo = await User.create({
        name: 'Demo User',
        email: DEMO_EMAIL,
        passwordHash: DEMO_PASSWORD, // hashed by the User pre-save hook
        // no expiresAt — never expires
      });
      console.log(`Seeded demo account: ${DEMO_EMAIL}`);
    }

    const count = await Application.countDocuments({ user: demo._id });
    if (count === 0) {
      await Application.insertMany(
        SAMPLE_APPLICATIONS.map((a) => ({ ...a, user: demo._id })) // no expiresAt
      );
      console.log(`Seeded ${SAMPLE_APPLICATIONS.length} demo applications`);
    }
  } catch (err) {
    console.error(`Demo seed skipped: ${err.message}`);
  }
}
