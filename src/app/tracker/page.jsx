"use client";

import { useState, useEffect } from 'react';

const getTodayDateString = () => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export default function TrackerPage() {
  const [asteroids, setAsteroids] = useState([]);
  const [isAsteroidsLoading, setIsAsteroidsLoading] = useState(true);

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const today = getTodayDateString();
        const response = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=lAdhdmrRy8SIyfx43g1gs6Hht1n6bcmpS1RtK70z`);
        const data = await response.json();
        if (data.near_earth_objects && data.near_earth_objects[today]) {
          setAsteroids(data.near_earth_objects[today]);
        }
      } catch (err) {
        console.error("Failed downing NeoWs", err);
      } finally {
          setIsAsteroidsLoading(false);
      }
    };
    fetchAsteroids();
  }, []);

  const numHazards = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const aiSummary = `Risk Assessment: Today, ${asteroids.length} asteroids are passing near Earth. ${numHazards === 0 ? "None are expected to heavily impact or threaten us." : `However, ${numHazards} are classified as potentially hazardous and must be monitored.`}`;

  return (
    <div className="min-h-screen bg-transparent font-sans px-6 sm:px-10 pt-10 pb-24 md:pb-10">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Asteroid Tracker Section */}
        <section>
          <div className="border-b border-[#102A50] pb-6 mb-8 mt-12">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              Asteroid Trajectory Array
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-8 flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
               <span className="text-[#00E5FF] font-black text-sm uppercase">AI</span>
            </div>
            <div>
              <h4 className="text-[#00E5FF] font-mono text-xs tracking-widest uppercase mb-2">AstroAide Report</h4>
              <p className="text-white font-medium leading-relaxed">{isAsteroidsLoading ? "Analyzing trajectory arrays..." : aiSummary}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[#AAAAAA] text-xs uppercase tracking-widest font-bold border-b border-[rgba(0,229,255,0.2)]">
                    <th className="p-6">Asteroid Name</th>
                    <th className="p-6">Diameter (Est. km)</th>
                    <th className="p-6">Closest Appr. (km/s)</th>
                    <th className="p-6 text-center">Hazard Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isAsteroidsLoading ? (
                    <tr>
                      <td colSpan="4" className="p-12 text-center">
                         <div className="flex items-center justify-center gap-3">
                           <div className="w-5 h-5 border-2 border-[#00E5FF] border-t-transparent inline-block animate-spin rounded-full"></div>
                           <span className="text-[#00E5FF] font-mono uppercase tracking-widest text-sm">Receiving secure data...</span>
                         </div>
                      </td>
                    </tr>
                  ) : asteroids.length > 0 ? (
                    asteroids.map((asteroid) => {
                      const isHazard = asteroid.is_potentially_hazardous_asteroid;
                      return (
                        <tr 
                          key={asteroid.id} 
                          className="border-b border-[rgba(0,229,255,0.2)] hover:bg-[#00E5FF]/10 transition-colors"
                        >
                          <td className="p-6 font-bold text-white tracking-wide">
                            {asteroid.name}
                          </td>
                          <td className="p-6 text-[#AAAAAA] font-mono">
                            {asteroid.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {asteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                          </td>
                          <td className="p-6 text-[#AAAAAA] font-mono">
                            {parseFloat(asteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || 0).toFixed(2)} km/s
                          </td>
                          <td className="p-6 text-center">
                            {isHazard ? (
                              <span className="inline-block px-4 py-1.5 bg-red-500/10 text-red-400 border border-red-500/60 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                                Alert
                              </span>
                            ) : (
                              <span className="inline-block px-4 py-1.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-[0_0_8px_rgba(0,229,255,0.2)]">
                                Safe
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="4" className="p-10 text-center text-[#666666]">No objects tracked today.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
