import ResearcherProfile from "@/components/custom/Researcher";

export default function Home() {

  const user = {
    "firstName": "Ayesha",
    "lastName": "Rahman",
    "email": "ayesha.rahman@example.com",
    "profilePicture": "https://example.com/images/ayesha.jpg",
    "cloudinaryPublicId": "users/ayesha_rahman",
    "bio": "Environmental engineer and researcher working on wastewater treatment, solid waste management, and data-driven sustainability solutions.",
    "fieldOfResearch": "Environmental Engineering",
    "institution": "University of Dhaka",

    "education": [
      {
        "institution": "University of Dhaka",
        "degree": "BSc in Environmental Engineering",
        "started": "2018-01-01",
        "completed": "2022-12-01",
        "ongoing": false,
        "result": "CGPA 3.72/4.00",
        "location": "Dhaka, Bangladesh"
      },
      {
        "institution": "Asian Institute of Technology",
        "degree": "MSc in Environmental Engineering",
        "started": "2023-01-01",
        "completed": null,
        "ongoing": true,
        "result": null,
        "location": "Pathum Thani, Thailand"
      }
    ],

    "papers": [
      {
        "title": "Machine Learning Approaches for Urban Wastewater Quality Prediction",
        "authors": [
          "Ayesha Rahman",
          "M. S. Islam"
        ],
        "journalName": "Journal of Environmental Informatics",
        "volume": "15",
        "year": 2023,
        "summary": "This study applies regression and neural network models to predict influent wastewater quality parameters.",
        "doi": "10.5678/jei.2023.33445",
        "fullPaperLink": "https://journals.example.com/wastewater-ml",
        "highlights": "Data-driven modeling of BOD and COD concentrations",
        "citations": 12
      },
      {
        "title": "Assessment of Solid Waste Segregation Practices in Developing Cities",
        "authors": [
          "Ayesha Rahman",
          "T. Hossain",
          "R. Karim"
        ],
        "journalName": "Waste Management & Research",
        "volume": "11",
        "year": 2022,
        "summary": "Evaluates household-level waste segregation behavior and policy implications.",
        "doi": "10.9012/wmr.2022.77881",
        "fullPaperLink": "https://journals.example.com/solid-waste-segregation",
        "highlights": "Field surveys combined with statistical analysis",
        "citations": 21
      }
    ],

    "researchProfile": {
      "papersPublished": 2,
      "underReview": 2,
      "citations": 33,
      "hIndex": 2,
      "i10Index": 1
    },

    "expertise": [
      "Wastewater Treatment",
      "Solid Waste Management",
      "Environmental Data Analysis",
      "Machine Learning Applications",
      "Sustainability Assessment"
    ],

    "professionalExperience": [
      {
        "jobTitle": "Environmental Engineer",
        "organization": "GreenTech Consulting Ltd.",
        "location": "Dhaka, Bangladesh",
        "startDate": "2022-07-01",
        "endDate": null,
        "ongoing": true,
        "briefDescription": "Provides environmental impact assessments and wastewater system design.",
        "contributions": "Designed treatment process layouts and developed predictive monitoring models."
      },
      {
        "jobTitle": "Research Intern",
        "organization": "Center for Environmental Studies, DU",
        "location": "Dhaka, Bangladesh",
        "startDate": "2021-05-01",
        "endDate": "2021-09-01",
        "ongoing": false,
        "briefDescription": "Assisted in solid waste characterization studies.",
        "contributions": "Conducted field surveys and performed statistical data analysis."
      }
    ],

    "achievements": [
      {
        "name": "Young Researcher Award",
        "issuingOrganization": "Bangladesh Environmental Society",
        "description": "Awarded for impactful research on wastewater quality modeling.",
        "links": [
          "https://example.com/awards/young-researcher"
        ]
      },
      {
        "name": "Best Poster Presentation",
        "issuingOrganization": "International Conference on Sustainable Environment",
        "description": "Recognized for poster on machine learning in environmental monitoring.",
        "links": [
          "https://example.com/conferences/icse-poster",
          "https://news.example.com/icse-best-poster"
        ]
      }
    ],

    "researchOutlook": {
      "googleScholarProfile": "https://scholar.google.com/citations?user=xyz987",
      "researchGateProfile": "https://www.researchgate.net/profile/Ayesha-Rahman",
      "orcid": "0000-0002-9876-5432",
      "linkedInProfile": "https://www.linkedin.com/in/ayesha-rahman"
    },

    "contact": {
      "email": "ayesha.rahman@du.ac.bd",
      "phone": "+8801800000000",
      "officeLocation": "Department of Environmental Engineering, University of Dhaka",
      "facebook": "https://facebook.com/ayesha.rahman",
      "twitter": "https://twitter.com/ayesha_env",
      "linkedIn": "https://www.linkedin.com/in/ayesha-rahman"
    }
  }

  
  return (
    <>
      <ResearcherProfile user={user} />
    </>
  );
}
