const schedule = [
  {
    time: "7:00 am",
    classes: [
      { day: "Monday", has: false },
      { day: "Tuesday", has: true, name: "Yoga Class", time: "7:00 am - 8:00 am" },
      { day: "Wednesday", has: false },
      { day: "Thursday", has: true, name: "Yoga Class", time: "7:00 am - 8:00 am" },
      { day: "Friday", has: false },
      { day: "Saturday", has: true, name: "Yoga Class", time: "7:00 am - 8:00 am" },
    ],
  },
  {
    time: "6:00 pm",
    classes: [
      { day: "Monday", has: true, name: "Yoga Class", time: "6:00 pm - 7:00 pm" },
      { day: "Tuesday", has: false },
      { day: "Wednesday", has: true, name: "Yoga Class", time: "6:00 pm - 7:00 pm" },
      { day: "Thursday", has: false },
      { day: "Friday", has: true, name: "Yoga Class", time: "6:00 pm - 7:00 pm" },
      { day: "Saturday", has: false },
    ],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimetableSection = () => {
  return (
    <section id="pricing" className="py-20 bg-[hsl(200,30%,90%)]">
      <div className="container mx-auto px-8">
        <h2 className="yoga-section-title text-center mb-16 italic text-foreground">
          Classes Timetable
        </h2>

        <div className="max-w-5xl mx-auto">
          {/* Table */}
          <div className="overflow-x-auto border border-yoga-purple rounded-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-yoga-purple">
                  <th className="p-4 text-left font-body text-sm"></th>
                  {days.map((day) => (
                    <th
                      key={day}
                      className="p-4 text-center font-body text-sm text-foreground bg-[hsl(270,30%,95%)] border-l border-yoga-purple"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-yoga-purple last:border-b-0">
                    <td className="p-4 font-body text-sm text-muted-foreground">
                      {row.time}
                    </td>
                    {row.classes.map((cls, colIndex) => (
                      <td
                        key={colIndex}
                        className={`p-4 text-center border-l border-yoga-purple ${
                          cls.has ? "bg-yoga-purple" : ""
                        }`}
                      >
                        {cls.has && (
                          <div className="text-white">
                            <p className="font-body text-sm font-medium">{cls.name}</p>
                            <p className="font-body text-xs opacity-90">{cls.time}</p>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-muted-foreground font-body text-sm mt-6">
            Group Sessions, Family Sessions and Private / One on One Sessions: (By appointment at mutually convenient time)
          </p>
        </div>
      </div>
    </section>
  );
};

export default TimetableSection;
