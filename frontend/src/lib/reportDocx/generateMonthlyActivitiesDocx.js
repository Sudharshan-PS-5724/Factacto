import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  TextRun,
  UnderlineType,
} from 'docx';
import { saveAs } from 'file-saver';

const COLLECTION_KEYS = [
  'erecog', 'ijp', 'njp', 'book', 'nca', 'ica', 'ps', 'pa', 'ifps', 'ifpf', 'pat', 'si',
  'fdpa', 'ea', 'webc', 'fdpc', 'semc', 'wc', 'icc', 'ncc', 'indc', 'mou', 'ai', 'cv', 'oa',
  'scc', 'sec', 'ntsa',
];

export function fetchAllArrayToResult(data) {
  if (!Array.isArray(data)) return {};
  const result = {};
  data.forEach((item) => {
    if (item.collection && Array.isArray(item.records)) {
      result[item.collection] = item.records;
    }
  });
  return result;
}

function normalizeResult(result) {
  const out = { ...result };
  COLLECTION_KEYS.forEach((k) => {
    if (!Array.isArray(out[k])) out[k] = [];
  });
  return out;
}

/**
 * Build monthly activities DOCX from MongoDB /fetchall-shaped result map.
 * @param {Record<string, unknown[]>} rawResult - map of collection name -> documents
 * @param {{ reportMonth?: string; reportYear?: string; fileName?: string }} [options]
 */
export async function generateMonthlyActivitiesDocx(rawResult, options = {}) {
  const result = normalizeResult(rawResult || {});
  const reportMonth = options.reportMonth ?? 'January';
  const reportYear = options.reportYear ?? String(new Date().getFullYear());

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    let year_string;
    let data;
    // Sample list of External Recognition Activities

    const erecog_activities = result["erecog"];

    function removeRepeatingCommas(str) {
        return str.replace(/,+\s*,+/g, ', ');
    }
    
        
    var erecog_num = 141; //Index Number of the Last Erecog Currently
    if (erecog_activities.length == 0) {
        erecog_num = "NIL";
    }

    if (report_year.length === 4) {
        const start_year = parseInt(report_year) - 1;
        const end_year = report_year.slice(2);
        year_string = `${start_year}-${end_year}`;
    } else {
        // Handle the case when the report_year is not in the expected format
        year_string = "Invalid year format";
    }

    // Initialize children array for paragraphs
    const children = [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: "SSN COLLEGE OF ENGINEERING, KALAVAKKAM - 603 110",
                    bold: true,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                    bold: true,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: "DEPARTMENT OF INFORMATION TECHNOLOGY",
                    bold: true,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new TextRun({
                    text: `${year}-${month}-${day}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: `MONTHLY ACTIVITIES OF THE DEPARTMENT (${reportMonth} ${reportYear})`,
                    bold: true,
                    size: 24,
                    underline: {
                        type: UnderlineType.SINGLE,
                    },
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                    bold: true,
                }),
            ]
        }),
    ];

    // External Recognition Activities Header
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `1. External Recognition (${erecog_activities.length})`,
                    bold: true,
                    size: 24,
                    })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: " ",
                    size: 24,
                    })
            ]
        }),
    )

    // Iterate through the list of External Recognitions
    erecog_activities.forEach(activity => {
        erecog_num = erecog_num + 1;
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `IT/${year_string}/ER/${erecog_num} `,
                        bold: true,
                        size: 24,
                    }),
                    new TextRun({
                        text: `${activity.name}, ${activity.activity}.`,
                        size: 24,
                    }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: " ",
                    }),
                ]
            })
        );
    });

    //Store erecog_num back !   




    /* IJP Header (i.e V. Sivamurugan has published the following paper(s)) Do later.
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `2. Research Activities (${research_num})`,
                    bold: true,
                    size: 24,
                    })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: " ",
                    size: 24,
                    })
            ]
        }),
    )
    */

    // Sample list of International Journal Papers
    // Check which ones can be None/null

    var ijp_num = 25 //Index Number of Last IJP
    var njp_num = 25 //Index Number of Last NJP
    var book_num = 4

    
    const international_journal_papers = result["ijp"];
    
    const national_journal_papers = result["njp"];

    const book_chapters = result["book"];
    
      
      // Loop through each paper in the list
      for (const paper of international_journal_papers) {
        // Loop through each key-value pair in the paper object
        for (const key in paper) {
          // Check if the value is null and replace it with an empty string
          if (paper[key] === null) {
            paper[key] = "";
          }
        }
      }      

      // Loop through each paper in the list
      for (const paper of national_journal_papers) {
        // Loop through each key-value pair in the paper object
        for (const key in paper) {
          // Check if the value is null and replace it with an empty string
          if (paper[key] === null) {
            paper[key] = "";
          }
        }
      }

      for (const paper of book_chapters) {
        // Loop through each key-value pair in the paper object
        for (const key in paper) {
          // Check if the value is null and replace it with an empty string
          if (paper[key] === null) {
            paper[key] = "";
          }
        }
      }


    // Research Activities Header
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `2. Research Activities (${international_journal_papers.length + national_journal_papers.length + book_chapters.length})`,
                    bold: true,
                    size: 24,
                    })
            ]
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: " ",
                    size: 24,
                    })
            ]
        }),
    )

    // Iterate through the list of International Journal Papers
    // CHANGES TO BE MADE: Need to account for no doi !!

    international_journal_papers.forEach(activity => {
        ijp_num = ijp_num + 1;
        const authors = [
            activity.first_author,
            activity.co_auth_ssn_fac,
            activity.co_auth_ssn_rs,
            activity.co_auth_ssn_stud,
            activity.co_auth_outsider
        ].filter(Boolean).join(', ');
    
        const citationPrefix = `IT/${year_string}/IJP/${ijp_num}`;
        const citationSuffix = [
            authors,
            activity.year,
            activity.month,
            activity.title_paper,
            activity.journal_name,
            `${activity.volume_num}(${activity.issue_num})`,
            `${activity.pg_from}-${activity.pg_to}`,
            activity.doi, activity.dop
        ].filter(Boolean).join(', ');
    
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: citationPrefix,
                        bold: true,
                        size: 24,
                    }),
                    new TextRun({
                        text: ` ${citationSuffix}`,
                        size: 24,
                    })
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: " ",
                    })
                ]
            })
        );
    });
    
    
    national_journal_papers.forEach(activity => {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `IT/${year_string}/NJP/${++njp_num} `,
                        bold: true,
                        size: 24,
                    }),
                    new TextRun({
                        text: removeRepeatingCommas(`Dr. ${activity.name}, ${activity.title_paper}, ${activity.authors}, ${activity.journal_name}, ${activity.volume}, ${activity.pages}, ${activity.year}, ${activity.indexed}, ${activity.impact}, ${activity.doi}, ${activity.dop}`),
                        size: 24,
                    }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: " ",
                    }),
                ]
            })
        );
    });

    book_chapters.forEach(activity => {
        children.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `IT/${year_string}/NJP/${++book_num} `,
                        bold: true,
                        size: 24,
                    }),
                    new TextRun({
                        text: removeRepeatingCommas(`Dr. ${activity.name}, ${activity.title_book}, ${activity.authors}, Edited by ${activity.editor}, ${activity.volume}, ${activity.doi}, ${activity.dop}, Published by ${activity.name_publisher}`),
                        size: 24,
                    }),
                ]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: " ",
                    }),
                ]
            })
        );
    });

        

    //Conference Activity

    const national_conferences_attended = result["nca"];
    
    const international_conferences_attended = result["ica"];


// Initialize index numbers
var nc_num = 3; // Index Number of Last NC
var ic_num = 5; // Index Number of Last IC

// Generate the report
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `3. Conference Activity (${national_conferences_attended.length + international_conferences_attended.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
);

national_conferences_attended.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/NC/${++nc_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}.`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

international_conferences_attended.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/IC/${++ic_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}.`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Project News

const projects_sanctioned = result["ps"];

const projects_applied = result["pa"];

const student_ifp = result["ifps"];

const faculty_ifp = result["ifpf"];


// Initialize index numbers
var ps_num = 1; // Index Number of Last PS
var pa_num = 26; // Index Number of Last PA


// Generate the report
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `4. Project News (${projects_sanctioned.length + projects_applied.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
);

projects_sanctioned.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/PS/${++ps_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, for a duration of ${activity.duration}, with a budget of ${activity.amount}`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

projects_applied.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/PA/${++pa_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, for a duration of ${activity.duration}, with a budget of ${activity.amount}`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});


student_ifp.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/PA/${++pa_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, for a duration of ${activity.duration}, with a budget of ${activity.amount}`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

faculty_ifp.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/PA/${++pa_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, for a duration of ${activity.duration}, with a budget of ${activity.amount}`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Patent Information

// Sample list of dictionaries
const patents = result["pat"];
// Initialize index number
var pat_num = 1; // Index Number of Last Pat

// Generate the report
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `5. Patent Info (${patents.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
);

patents.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Pat/${++pat_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}.`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Scholar Related

// Sample list of dictionaries
const scholars = result["si"];

// Initialize index number
var scholar_num = 11; // Index Number of Last Scholar

// Generate the report
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `6. Scholar related (${scholars.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
);

scholars.forEach(activity => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Ph.D/${++scholar_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}.`),
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// FDP/WS/Webinar Attended

const fdp_attended = result["fdpa"];

const events_attended = result["ea"];

const workshops_attended = events_attended.filter(event => event.type_of_event === "Workshop");
const other_events_attended = events_attended.filter(event => event.type_of_event !== "Workshop");

// Initialize fdp_num for FDP/STTP Attended
let fdp_num = 7;

// FDP/STTP Attended Header
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `7. FDP/WS/Webinar attended (${fdp_attended.length + events_attended.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: "FDP attended (" + fdp_attended.length + ")",
                bold: true,
                size: 24,
            })
        ]
    })
);

// Iterate through FDP/STTP Attended list
fdp_attended.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: ` `,
                }),
                new TextRun({
                    text: `IT/${year_string}/FDP/${fdp_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}.`,
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Initialize ws_num for Workshops Attended
let ws_num = 2;

// Workshop Attended Header
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: "Workshops Attended (" + workshops_attended.length + ")",
                bold: true,
                size: 24,
            })
        ]
    })
);

// Iterate through Workshops Attended list
workshops_attended.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: ` `,
                }),
                new TextRun({
                    text: `IT/${year_string}/WS/${ws_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.describe}.`,
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Initialize ea_num for Events Attended
let ea_num = 11;

// Events Attended Header
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: "Events Attended (" + other_events_attended.length + ")",
                bold: true,
                size: 24,
            })
        ]
    })
);

// Iterate through Events Attended list
other_events_attended.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: ` `,
                }),
                new TextRun({
                    text: `IT/${year_string}/EA/${ea_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.describe}.`,
                    size: 24,
                })
            ]
        }), 
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});


// Events Conducted

webinars_conducted = result["webc"];

fdp_conducted = result["fdpc"];


seminars_conducted = result["semc"];


workshops_conducted = result["wc"];


international_conference_conducted = result["icc"];


national_conference_conducted = result["ncc"];


// Events Conducted Header
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `8. Events Conducted (${webinars_conducted.length + fdp_conducted.length + seminars_conducted.length + workshops_conducted.length + international_conference_conducted.length + national_conference_conducted.length})`,
                bold: true,
                size: 24,
            })
        ]
    })
);

let web_num = 20;

// Webinar/Guest Lecture Conducted (Web)
webinars_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Web/${web_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

let fdp_conducted_num = 25;

// FDP and STTP Conducted (FDP)
fdp_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/FDP/${fdp_conducted_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, Number of Participants:  ${activity.no_of_participants}, Sponsored by:  ${activity.name_of_sponsor}, Amount: ${activity.amnt}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

let sem_num = 33;

// Seminar Conducted (Sem)
seminars_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Sem/${sem_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

let ws_conducted_num = 16;

// Workshop Conducted (WS)
workshops_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/WS/${ws_conducted_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});


let inc_num = 4;

// International Conference Conducted (INC)
international_conference_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/INC/${inc_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, Number of Participants:  ${activity.no_of_participants}, Sponsored by:  ${activity.name_of_sponsor}, Amount: ${activity.amnt}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

let nc_conducted_num = 6;

// National Conference Conducted (NC)
national_conference_conducted.forEach((activity) => {
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/NC/${nc_num++} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: removeRepeatingCommas(`${activity.name}, ${activity.details}, Number of Participants:  ${activity.no_of_participants}, Sponsored by:  ${activity.name_of_sponsor}, Amount: ${activity.amnt}.`),
                    size: 24,
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Industry Collaboration
const industry_collaboration = result["indc"];
const mou_activities = result["mou"];


var ind_collab_num = 50; // Initialize the index number

// Header for Industry Collaboration
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `9. Industry Collaboration (${industry_collaboration.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)

// Iterate through the list of Industry Collaborations
industry_collaboration.forEach(activity => {
    ind_collab_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/IC/${ind_collab_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});


// Store ind_collab_num back ! 

var mou_num = 16; // Initialize the index number for MoU

// Iterate through the list of MoU activities
mou_activities.forEach(activity => {
    mou_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/IC/${mou_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Store mou_num back ! 

// Alumni Interactions

const alumni_interactions = result["ai"];


// Header forAlumni Interactions
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `10. Alumni Interactions (${alumni_interactions.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)



var alumni_num = 7; // Initialize the index number for Alumni Interactions

// Iterate through the list of Alumni Interactions
alumni_interactions.forEach(activity => {
    alumni_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Alumni/${alumni_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Store alumni_num back ! 

// Notable Visitors

const notable_visitors = result["cv"];


// Header for Notable Visitors
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `11. Notable Visitors (${notable_visitors.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)


var cv_num = 4; // Initialize the index number for Celebrity Visitors

// Iterate through the list of Notable Visitors
notable_visitors.forEach(visitor => {
    cv_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/CV/${cv_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${visitor.name}, ${visitor.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Store cv_num back ! 

// Other Activities

const other_activities = result["oa"];

// Header for Other Activities
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `12. Other Activities (${other_activities.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)


var oth_num = 10; // Initialize the index number for Other Activities

// Iterate through the list of Other Activities
other_activities.forEach(activity => {
    oth_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/Oth/${oth_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Store oth_num back ! 

// Students Activities

// Header for Student Activities
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `B. Student Activities`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)


const student_external_recognition_co_curricular = result["scc"];

const student_external_recognition_extra_curricular = result["sec"];

var serc_num = 1; // Initialize the index number for Student External Recognition Co-curricular
var sere_num = 3; // Initialize the index number for Student External Recognition Extra-curricular

// Header for Student External Recognition Co-curricular
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `1. Student External Recognition Co-curricular (${student_external_recognition_co_curricular.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)

// Iterate through the list of Student External Recognition Co-curricular
student_external_recognition_co_curricular.forEach(activity => {
    serc_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/SERC/${serc_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Header for Student External Recognition Extra-curricular
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `2. Student External Recognition Extra-curricular (${student_external_recognition_extra_curricular.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)

// Iterate through the list of Student External Recognition Extra-curricular
student_external_recognition_extra_curricular.forEach(activity => {
    sere_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/SERE/${sere_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});

// Store serc_num and sere_num back !

// Non-Teaching-Staff Activities

non_teaching_staff_activities = result["ntsa"];


// Header for Non-Teaching Staff Activities
children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `C. Non-Teaching Staff Activities (${non_teaching_staff_activities.length})`,
                bold: true,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)


var ntsa_num = 3;

// Iterate through the list of Non-Teaching Staff Activities
non_teaching_staff_activities.forEach(activity => {
    ntsa_num++;
    children.push(
        new Paragraph({
            children: [
                new TextRun({
                    text: `IT/${year_string}/NT/${ntsa_num} `,
                    bold: true,
                    size: 24,
                }),
                new TextRun({
                    text: `${activity.name}, ${activity.details}`,
                    size: 24,
                }),
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new TextRun({
                    text: " ",
                }),
            ]
        })
    );
});


children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
)



// Signatures

children.push(
    new Paragraph({
        children: [
            new TextRun({
                text: `Prepared by \t\t\t\t\t\t\t\t\t Approved by`,
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: " ",
                size: 24,
            })
        ]
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: "S. Karthika, E. Suganya \t\t\t\t\t\t\t HoD, IT",
                size: 24,
            })
        ]
    }),
)



    

    // Create the document with the children array
    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const blob = await Packer.toBlob(doc);
  const fname = options.fileName ?? `monthly-activities-${reportMonth}-${reportYear}.docx`.replace(/\s+/g, '-');
  saveAs(blob, fname);
  return blob;
}
