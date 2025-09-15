import { runEventReminders } from './src/reminders';

export async function handler() {
  await runEventReminders();
}
