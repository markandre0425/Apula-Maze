export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation: string;
  relatedTipId?: number; // References a safetyTip id if applicable
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What should you do first in case of a fire in your home?",
    options: [
      "Open windows to let the smoke out",
      "Alert everyone in the home and help them evacuate",
      "Collect your valuables",
      "Call the fire department immediately"
    ],
    correctAnswer: 1, // Alert everyone and evacuate
    explanation: "The first priority in any fire is to ensure everyone's safety by alerting them to the danger and helping them evacuate. After everyone is safe, call emergency services from outside the building.",
    relatedTipId: 1
  },
  {
    id: 2,
    question: "How often should you test your smoke alarms?",
    options: [
      "Once a year",
      "Once a month",
      "Once a week",
      "Only after a fire incident"
    ],
    correctAnswer: 1, // Once a month
    explanation: "Smoke alarms should be tested monthly to ensure they're working properly. Batteries should be replaced at least once a year, or whenever the alarm chirps, indicating low battery.",
    relatedTipId: 2
  },
  {
    id: 3,
    question: "What should you do if your clothing catches fire?",
    options: [
      "Run to find water",
      "Wave your arms to extinguish the flames",
      "Stop, drop, and roll",
      "Remove the clothing immediately"
    ],
    correctAnswer: 2, // Stop, drop, and roll
    explanation: "If your clothes catch fire, the best action is to stop immediately, drop to the ground, and roll back and forth to smother the flames. Running only makes the fire burn faster.",
    relatedTipId: 5
  },
  {
    id: 4,
    question: "What does the acronym PASS stand for when using a fire extinguisher?",
    options: [
      "Pull, Aim, Spray, Sweep",
      "Protect, Alert, Secure, Safety",
      "Pull, Aim, Squeeze, Sweep",
      "Point, Activate, Shoot, Stop"
    ],
    correctAnswer: 2, // Pull, Aim, Squeeze, Sweep
    explanation: "PASS stands for: Pull the pin, Aim low at the base of the fire, Squeeze the handle, and Sweep from side to side. This is the proper technique for using most fire extinguishers.",
    relatedTipId: 9
  },
  {
    id: 5,
    question: "What should you do if you encounter smoke while evacuating during a fire?",
    options: [
      "Run quickly through the smoke",
      "Stand up tall to get above the smoke",
      "Stay low and crawl under the smoke",
      "Hold your breath and walk normally"
    ],
    correctAnswer: 2, // Stay low and crawl
    explanation: "Smoke and toxic gases rise, so the cleanest air will be near the floor. Stay low and crawl to the nearest exit to minimize smoke inhalation.",
    relatedTipId: 6
  },
  {
    id: 6,
    question: "Before opening a door during a fire, what should you do?",
    options: [
      "Open it quickly to check if there's fire on the other side",
      "Feel the door and doorknob with the back of your hand",
      "Kick the door down to create an escape route",
      "Pour water on the door to cool it down"
    ],
    correctAnswer: 1, // Feel the door and doorknob
    explanation: "Before opening any door during a fire, feel the door and doorknob with the back of your hand. If either is hot, don't open the door as fire may be on the other side. Use your alternate escape route.",
    relatedTipId: 7
  },
  {
    id: 7,
    question: "What should you do if a grease fire starts in a pan on your stove?",
    options: [
      "Pour water on it to extinguish the flames",
      "Move the pan to the sink",
      "Cover the pan with a lid or use baking soda",
      "Fan the fire to disperse the flames"
    ],
    correctAnswer: 2, // Cover with lid or use baking soda
    explanation: "Never use water on a grease fire as it can cause the fire to spread. Instead, turn off the heat source if possible and smother the fire by covering the pan with a lid, or use baking soda for small fires.",
    relatedTipId: 3
  },
  {
    id: 8,
    question: "How many escape routes should you have from each room in your home?",
    options: [
      "One is sufficient",
      "At least two",
      "At least three",
      "It depends on the room size"
    ],
    correctAnswer: 1, // At least two
    explanation: "You should know at least two ways out of every room in your home. This ensures that if one exit is blocked by fire or smoke, you have an alternative route.",
    relatedTipId: 1
  },
  {
    id: 9,
    question: "What is the most effective way to prevent electrical fires?",
    options: [
      "Use multiple extension cords to distribute the load",
      "Cover electrical equipment with cloth for insulation",
      "Keep electrical cords under carpets to protect them",
      "Don't overload outlets and replace damaged cords"
    ],
    correctAnswer: 3, // Don't overload outlets
    explanation: "To prevent electrical fires, avoid overloading outlets, use proper extension cords temporarily (not permanently), keep cords away from water, and replace any damaged cords immediately.",
    relatedTipId: 10
  },
  {
    id: 10,
    question: "After evacuating a burning building, what should you do?",
    options: [
      "Go back in to retrieve important items",
      "Go to your designated meeting place and call for help",
      "Wait by the entrance to guide firefighters",
      "Try to fight the fire from outside"
    ],
    correctAnswer: 1, // Go to meeting place and call
    explanation: "After evacuating, go to your pre-designated meeting place so everyone can be accounted for, and call 911 or the local emergency number. Never re-enter a burning building for any reason.",
    relatedTipId: 8
  }
];