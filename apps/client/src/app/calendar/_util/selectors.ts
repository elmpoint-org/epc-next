import plugin from 'tailwindcss/plugin';

export const calendarSelectors = plugin(({ addVariant }) => {
  addVariant('popover', '.mantine-Popover-dropdown:has(&)');
});
