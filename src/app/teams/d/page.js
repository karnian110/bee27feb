import 'server-only'
import TeamDetails from "@/components/custom/TeamDetails";
export default function Home() {

  const team = {
  "teamName": "CCCCCCognitive AI Research Lab",
  "email": "contact@cogai-lab.com",
  "owner": {
    "userId": "64ff3b9e7b8a2d0012345678",
    "firstName": "Alice",
    "lastName": "Wong",
    "email": "alice.wong@example.com"
  },
  "profilePicture": "https://example.com/images/cogai-lab.png",
  "members": [
    {
      "firstName": "Bob",
      "lastName": "Lee",
      "email": "bob.lee@example.com",
      "role": "Research Scientist",
      "joinedAt": "2022-03-15T00:00:00.000Z"
    },
    {
      "firstName": "Carol",
      "lastName": "Nguyen",
      "email": "carol.nguyen@example.com",
      "role": "Postdoctoral Fellow",
      "joinedAt": "2023-01-10T00:00:00.000Z"
    }
  ],
  "about": "We focus on developing cognitive AI systems for human-robot interaction.",
  "fieldOfResearch": "Artificial Intelligence",
  "researchProfile": {
    "papersPublished": 15,
    "underReview": 3,
    "citations": 240,
    "hIndex": 7,
    "i10Index": 10
  },
  "papers": [
    {
      "title": "Deep Reinforcement Learning for Collaborative Robots",
      "authors": ["Alice Wong", "Bob Lee"],
      "journalName": "Journal of AI Research",
      "volume": "52",
      "year": 2023,
      "summary": "Study on reinforcement learning in collaborative robotics.",
      "doi": "10.1234/jair.2023.5678",
      "fullPaperLink": "https://example.com/papers/deep-rl-collab-robots.pdf",
      "highlights": "Introduced a novel RL framework for human-robot collaboration.",
      "citations": 35
    }
  ],
  "expertise": ["Machine Learning", "Reinforcement Learning", "Human-Robot Interaction"],
  "achievements": [
    {
      "name": "Best AI Paper Award",
      "issuingOrganization": "International AI Conference",
      "description": "Awarded for outstanding contributions in cognitive AI research.",
      "links": ["https://example.com/awards/best-ai-paper"]
    }
  ],
  "researchOutlook": {
    "googleScholarProfile": "https://scholar.google.com/citations?user=ABC123",
    "researchGateProfile": "https://www.researchgate.net/profile/Alice_Wong",
    "orcid": "0000-0002-3456-7890",
    "linkedInProfile": "https://www.linkedin.com/in/alice-wong"
  },
  "contact": {
    "email": "contact@cogai-lab.com",
    "phone": "+1-555-1234",
    "officeLocation": "Building A, Room 210",
    "facebook": "https://www.facebook.com/cogai-lab",
    "twitter": "https://twitter.com/cogai_lab",
    "linkedIn": "https://www.linkedin.com/company/cogai-lab"
  }
}

  return (
    <>
      <TeamDetails user={team} />
    </>
  );
}
