export interface SafetyTip {
  id: number;
  title: string;
  content: string;
}

export const safetyTips: SafetyTip[] = [
  {
    id: 1,
    title: "Create a Home Fire Escape Plan",
    content: "Make sure everyone in your home knows at least two ways to escape from each room. Decide on a meeting place outside. Practice your escape plan at least twice a year."
  },
  {
    id: 2,
    title: "Install Smoke Alarms",
    content: "Install smoke alarms on every level of your home, inside bedrooms, and outside sleeping areas. Test smoke alarms every month and replace batteries at least once a year."
  },
  {
    id: 3,
    title: "Kitchen Safety",
    content: "Never leave cooking food unattended. Keep a lid nearby when cooking to smother small grease fires. For an oven fire, turn off the heat and keep the door closed."
  },
  {
    id: 4,
    title: "Put It Out Correctly",
    content: "Different fires require different extinguishers. For grease fires, never use water! Instead, smother the flames or use a Class B fire extinguisher."
  },
  {
    id: 5,
    title: "Stop, Drop, and Roll",
    content: "If your clothes catch fire: STOP where you are, DROP to the ground, and ROLL over and over to smother the flames."
  },
  {
    id: 6,
    title: "Stay Low in Smoke",
    content: "If you have to escape through smoke, get low and crawl under the smoke to your exit. Heavy smoke and poisonous gases collect first along the ceiling."
  },
  {
    id: 7,
    title: "Check Doors Before Opening",
    content: "Before opening a door during a fire, feel the doorknob and door with the back of your hand. If either is hot, leave the door closed and use your second way out."
  },
  {
    id: 8,
    title: "Call 911",
    content: "In case of a fire emergency, call 911 immediately after you are safely outside. Never go back inside a burning building for any reason."
  },
  {
    id: 9,
    title: "Fire Extinguisher Use: PASS",
    content: "To use a fire extinguisher, remember PASS: Pull the pin, Aim low at the base of the fire, Squeeze the handle, and Sweep from side to side."
  },
  {
    id: 10,
    title: "Electrical Safety",
    content: "Don't overload outlets or extension cords. Replace any electrical cord that is cracked or damaged. Keep electrical appliances away from water."
  }
];
