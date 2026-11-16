export const site = {
  name: 'Team Maverick', institution: "PVG’s College of Engineering and Technology, Pune",
  address: '44, Shiv Darshan Road, Parvati, Pune, Maharashtra 411009',
  apply: 'https://forms.gle/vCBNfqPnxKTGfSaEA',
  instagram: 'https://www.instagram.com/teammaverick_fsae/',
  linkedin: 'https://www.linkedin.com/company/team-maverick/',
  official: 'https://www.tmaverick.in/',
};
export const navigation = [
  ['Home', '/'], ['About', '/about'], ['Our Cars', '/cars'], ['Departments', '/departments'],
  ['Achievements', '/achievements'], ['Sponsors', '/sponsors'], ['Join Us', '/join'], ['Contact', '/contact'],
] as const;
export const assets = {
  logo: '/images/logo-trimmed.png', car: '/images/avira-2.png', team: '/images/team.jpg', trophies: '/images/trophies.jpg',
};
export const departments = [
  { slug: 'chassis', name: 'Chassis', short: 'The foundation of performance.', description: 'A rigid structure. A considered driving position. The chassis brings every system together, balancing structural integrity, driver safety, and ergonomics.', focus: 'Structure / Safety / Ergonomics', point: [49, 57] },
  { slug: 'vehicle-dynamics', name: 'Vehicle Dynamics', short: 'Every corner is a calculation.', description: 'Suspension geometry, tyre behaviour, and vehicle kinematics turn engineering decisions into mechanical grip. The objective: a car that responds precisely to its driver.', focus: 'Suspension / Kinematics / Handling', point: [72, 72] },
  { slug: 'aerodynamics', name: 'Aerodynamics', short: 'Make the invisible count.', description: 'Computational fluid dynamics helps the department understand airflow and the relationship between downforce and drag.', focus: 'Airflow / CFD / Downforce', point: [23, 68] },
  { slug: 'braking', name: 'Braking', short: 'Confidence at the limit.', description: 'Rotor design, brake assemblies, and thermal management work together to deliver controlled, repeatable deceleration.', focus: 'Rotors / Thermal management / Control', point: [76, 68] },
  { slug: 'transmission', name: 'Transmission', short: 'Put the power to work.', description: 'The drivetrain connects engine output to the wheels. Transmission development focuses on torque transfer, shifting, and driveline efficiency.', focus: 'Drivetrain / Shifting / Torque transfer', point: [39, 57] },
  { slug: 'powertrain-lv', name: 'Powertrain / LV', short: 'The heart. And the nervous system.', description: 'Engine performance meets low-voltage electronics. The team integrates power delivery with the control and data systems that support the car.', focus: 'Engine / Low voltage / Data acquisition', point: [43, 51] },
  { slug: 'sponsorship-pr', name: 'Sponsorship & PR', short: 'Build the partnerships behind the car.', description: 'Industry relationships and sponsorship make student engineering possible. This department connects the team’s work with the organisations that support it.', focus: 'Partnerships / Outreach / Communication', point: [52, 43] },
  { slug: 'media', name: 'Media Team', short: 'Tell the story behind the speed.', description: 'Photography, film, and communication document the people, processes, and competition moments behind Team Maverick.', focus: 'Photography / Film / Storytelling', point: [58, 45] },
];
export const results = [
  { rank: '01', suffix: 'st', event: 'Overall · CV category', featured: true },
  { rank: '01', suffix: 'st', event: 'Acceleration' },
  { rank: '01', suffix: 'st', event: 'Skidpad' },
  { rank: '02', suffix: 'nd', event: 'Endurance' },
  { rank: '03', suffix: 'rd', event: 'Autocross' },
];
export const sponsors = [
  { name: 'MathWorks', image: '/images/sponsor-mathworks.png', url: 'https://www.mathworks.com/' },
  { name: 'Ansys', image: '/images/sponsor-ansys.png', url: 'https://www.ansys.com/' },
  { name: 'Flowcode', image: '/images/sponsor-flowcode.png', url: 'https://flowcodeautomation.com/' },
  { name: 'SOLIDWORKS', image: '/images/sponsor-solidworks.png', url: 'https://www.solidworks.com/' },
  { name: 'Nemade Engineers', image: '/images/sponsor-nemade.jpg', url: 'https://nemade.in/' },
  { name: 'Machinist Technology', image: '/images/sponsor-machinist.png', url: 'http://www.sme.in/machinisttechno/about-us.html' },
  { name: 'Kakade Lasers', image: '/images/sponsor-kakade.jpg', url: 'https://kakadelaser.in/' },
  { name: 'LaserTech', image: '/images/sponsor-lasertech.png', url: null },
];
export const alumni = [
  { name: 'Sarthak Shukla', role: 'Vice Captain · Class of 2025', image: '/images/sarthak.png', description: 'Reflects on developing engineering knowledge, leadership, and ownership through the team.' },
  { name: 'Vaid Kulkarni', role: 'Vehicle Dynamics Head · Class of 2024', image: '/images/vaid.png', description: 'Credits hands-on Formula Student experience as an important foundation for further study and industry work.' },
];
