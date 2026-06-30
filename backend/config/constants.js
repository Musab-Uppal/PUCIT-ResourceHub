/*
 * Why constants instead of a DB collection?
 * - Courses and teachers are admin-managed, infrequently changing data.
 * - Storing them in MongoDB adds a collection, a fetch on every upload form load,
 *   and complexity with no real benefit at this scale.
 * - A constants file is the single source of truth: both the Mongoose validator
 *   AND the frontend dropdown read from the same list (we'll expose them via an
 *   API endpoint so the frontend doesn't need its own copy).
 *
 * To add a course or teacher: just push to the array below and restart the server.
 */

const COURSES = [
  "Programming Fundamentals",    // PF
  "Object Oriented Programming", // OOP
  "Data Structures & Algorithms", // DSA
  "Database Systems",             // DBS
  "Operating Systems",            // OS
  "Computer Networks",            // CN
  "Software Engineering",         // SE
  "Compiler Construction",        // CC
  "Theory of Automata",           // ToA
  "Analysis of Algorithms",       // AoA
  "Artificial Intelligence",      // AI
  "Web Technologies",             // WT
  "Linear Algebra",               // LA
  "Calculus",
  "Discrete Mathematics",
  "Digital Logic Design",         // DLD
  "Computer Organization & Assembly Language", // COA
  "Expository Writing",
  "Functional English",
  "Application of ICT",
  "Probability and Statistics",
  "Entrepreneurship",
  "Professional Practices",
  "Software Construction and Development",
  "Software Design and Architecture",
  "Software Quality Engineering",
  "Software Project Management",
  "Software Requirements Engineering",
  "Introduction to Marketing",
  "Computer Vision",
  "Machine Learning",
  "Technical and Business Writing",
  "Quran Translation",
];

const TEACHERS = [
  // Add your department's teachers here — full names work best
  "Dr. Muhammad Shahid Farid",
  "Dr Shahzad Sarwar",
  "Dr. Muhammad Hassan Khan",
  "Dr. Nazar Khan",
  "Ch Ejaz Ashraf",
  "Dr. Laeeq Aslam",
  "Tayyaba Tariq",
  "Asim Rasul",
  "Dr Saadia Shahzad",
  "Nastaeen Fatima",
  "Dr Zobia Suhail",
  "Abdul Mateen",
  "Umair Babar",
  "Esha Aftab",
  "Dr Madeeha Aman",
  "Dr Ahmad Hassan Butt",
  "Dr Fatima Sabir",
  "Dr. Irfana Bibi",
  "Khadija Mariam",
  "Prof. Dr. Muhammad Murtaza Yousaf",
  "Dr. Ather Ashraf",
  "Fareed ul Hassan Baig",
  "Dr Abdul Khaliq",
  "Farhan Ahmad Ch",
  "Muhammad Zia Afzal",
  "Dr. Omer Nawaz",
  "Dr Muddassira Arshad",
  "Dr Amina Mustansir",
  "Dr. Shuja-ur-Rehman Baig",
  "Dr. Arifa Mirza",
  "Dr. Madiha Khalid",
  "Dr Mufssra Naz",
  "Mehwish Kayani",
  "Dr Sanam Ahmed",
  "Dr Natalia Chaudhry",
  "Prof. Dr. Waqar ul Qounain",
  "Dr Nadeem Akhtar",
  "Dr. Asif Sohail",
  "Dr Muhammad Adeel Nisar",
  "Muhammad Ahmad Ghazali",
  "Dr Sadeeqa Riaz Khan",
  "Kashif Murtaza",
  "Hafiz Anzar Ahmad",
  "Dr. Farsia Hussain",
  "Dr. Mian Muhammad Mubasher",
  "Dr. Muhammad Farooq",
  "Dr. Zara Nasar",
  "Maryam Nawaz Awan",
  "Prof. Dr. Muhammad Kamran Malik",
  "Prof. Dr. Adnan Abid",
  "Dr. Shahid Manzoor",
  "Dr. Muhammad Nadeem Majeed",
  "Dr. Syed Faisal Bukhari",
  "Dr. Khurram Shahzad",
  "Dr. Waheed Iqbal",
  "Dr. Zubair Nawaz",
  "Maj. (Retd.) Dr. Muhammad Arif Butt",
  "Dr. Muhammad Idrees",
  "Tariq Mahmood Butt",
  "Dr. Syed Muhammad Ali",
  "Imran Javed",
  "Dr. Muhammad Abdullah",
  "Sara Ejaz",
  "Nadia Mehak",
  "Amna Munir",
  "Humayoun Adil"
  // ... add more as needed
];

/*
 * Degree programs offered at FCIT/PUCIT.
 * Stored as an array so a resource can be tagged to multiple degrees.
 */
const DEGREES = ["CS", "IT", "SE", "DS"];

/*
 * Campus options — NC = New Campus, OC = Old Campus.
 */
const CAMPUSES = ["NC", "OC"];

module.exports = { COURSES, TEACHERS, DEGREES, CAMPUSES };
