import { motion } from 'framer-motion';

export const TeamPage = () => {
  /**
   * An array of team member profiles, each representing a contributor to the project.
   *
   * @typeParam name - The full name of the team member.
   * @typeParam role - The primary role(s) and responsibilities of the team member within the project.
   * @typeParam bio - A brief biography describing the member's background and contributions.
   * @typeParam skills - A list of key skills and technologies associated with the team member.
   * @typeParam github - The URL to the team member's GitHub profile.
   * @typeParam linkedin - The URL to the team member's LinkedIn profile.
   * @typeParam photo - (Optional) The URL to the team member's profile photo. If not provided, initials will be shown.
   */
  const teamMembers = [
    {
      name: 'Mohannad Essam',
      role: 'Project Lead & Full Stack Developer',
      bio: 'Passionate about space exploration and data visualization. Led the development of the interactive viewer and NASA data integration.',
      skills: ['React', 'TypeScript', 'OpenSeadragon', 'NASA APIs'],
      github: 'https://github.com/mohannad54xd',
      linkedin: 'https://linkedin.com/in/mohannad-essam-092aa02b9'
      ,
      photo: '/src/assets/team/mohannad.jpg'
    },
    {
      name: 'Mohannad Abd elnaby',
      role: 'UI/UX Designer & Frontend Developer',
      bio: 'Specializes in creating intuitive user experiences for complex data visualization. Designed the responsive interface and animations.',
      skills: ['Framer Motion', 'Tailwind CSS', 'User Research', 'Prototyping'],
      github: 'https://github.com/Mands-s',
      linkedin: 'https://www.linkedin.com/in/mohanad-abdelnaby-74130a2b3/'
      ,
      photo: '/src/assets/team/mands.jpg'
    },
    {
      name: 'Yehia Ahmed',
      role: 'Data Scientist & Backend Developer',
      bio: 'Expert in NASA data formats and geospatial analysis. Implemented the temporal data processing and layer management systems.',
      skills: ['Python', 'Geospatial Analysis', 'NASA GIBS', 'Data Processing'],
      github: 'https://github.com/marcusrodriguez',
      linkedin: 'https://linkedin.com/in/marcusrodriguez'
      ,
      photo: '/src/assets/team/yehia.jpg'
    },
    {
      name: 'Lauran Fayed',
      role: 'Scientific Advisor & Domain Expert',
      bio: 'Astrophysicist with expertise in space mission data. Provides scientific guidance and ensures data accuracy and interpretation.',
      skills: ['Astrophysics', 'Space Missions', 'Data Analysis', 'Scientific Communication'],
      github: 'https://github.com/emilywatson',
      linkedin: 'https://linkedin.com/in/emilywatson'
      ,
      photo: '/src/assets/team/lauran.jpg'
    },

    {
      name: 'Eman El Sayed',
      role: 'Frontend Engineer & Accessibility Lead',
      bio: 'Designs inclusive interfaces and implements accessibility-first components. Focuses on responsive layouts and keyboard navigation.',
      skills: ['Accessibility', 'React', 'Tailwind CSS', 'Inclusive Design'],
      github: 'https://github.com/aishakhan',
      linkedin: 'https://www.linkedin.com/in/aisha-khan-ux/',
      photo: '/src/assets/team/eman.jpg'
    }

    
  ];

  return (
  <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900/20 to-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              A diverse group of developers, designers, and scientists working together 
              to make NASA's data accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2 text-white">{member.name}</h3>
                    <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 mb-4">{member.bio}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Skills & Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      {member.github && (
                        <a 
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                      {member.linkedin && (
                        <a 
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Our Mission</h2>
            <p className="text-lg text-gray-300 mb-8">
              We believe that NASA's incredible datasets should be accessible to everyone. 
              Our diverse team combines technical expertise with scientific knowledge to create 
              tools that make space exploration data engaging and educational.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Accessibility</h3>
                <p className="text-gray-300">Making complex data simple and intuitive</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Scientific Accuracy</h3>
                <p className="text-gray-300">Ensuring data integrity and proper interpretation</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2 text-white">Innovation</h3>
                <p className="text-gray-300">Pushing the boundaries of data visualization</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Get In Touch</h2>
            <p className="text-lg text-gray-300 mb-8">
              Interested in collaborating or have questions about our project? 
              We'd love to hear from you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/mohannad54xd/bemos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
              <a 
                href="mailto:mohannadessam54@gmail.com"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};