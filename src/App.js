import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const KEY = "AIzaSyCb8IJfZs2wKQ5tfUP87HiJ9EKyWvPPe8U";

function App() {
  const [isScrollHintVisible, setIsScrollHintVisible] = useState(true);
  const personasRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isInstructionsVisible, setIsInstructionsVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const speechUtteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [altText, setAltText] = useState("");

  const personaData = [
    {
      id: 1,
      title: "Grandmother with Macular Degeneration",
      description:
        "Carol has always loved reading, so her fading eyesight is a sorrow to her. She tried recorded books, but she didn't like it. She made the transition from ledgers to a software program, so she's happy to use the computer. She has a computer, which she uses the same way she always did her work. She loves getting emails from her grandkids and friends. She likes reading magazine articles online, especially when they are free. Last year, she discovered that she could get her prescriptions more cheaply online, and now she buys some things from the web. Her biggest problem is that the text is so small. She's learned how to click on the symbol to make the text bigger, but is frustrated when it doesn't work the same way on every site. She also finds that her hands aren't as steady as they used to be, and she can't always click on things accurately. She likes her 'old fashioned' mobile phone with large buttons that she can feel easily. As her eyes get worse, she wonders how long she'll be able to keep using the computer. All that light gray text on a white screen. It's just too hard to see.",
      alt: "An elderly woman sitting at her desk, reading, with a cat sitting on her lap in a serene and warm environment.",
    },
    {
      id: 2,
      title: "Cerebral Palsy Living Independently",
      description:
        "Emily is determined to do things for herself, so she's tried a lot of different keyboards and joysticks over the years, looking for the right kind of interaction. Speech is difficult for her, so she uses a communications program with speech output. It's slow for her to type with limited use of her fingers. She has stored many phrases and sentences, and can make the program speak for her more easily. The iPad turned out to be one of the best solutions. Mounted on the scooter, it's always within reach, and touch works better than a keyboard and a joystick. In some situations, it can replace her older communications program. Instant messaging and social media have also been great. The short formats work well for her, and text can be a more comfortable way to communicate than speech. Her latest discovery is an app that scans the area to show her what shops and restaurants are in each direction. 'I look like a dancing fool spinning my scooter around, but it saves me a lot of time finding someplace new.'",
      alt: "A woman in a wheelchair enjoys a walk with her dog, who is happily on a leash beside her.",
    },
    {
      id: 3,
      title: "Blind, a bit of a geek",
      description:
        "Jacob is a paralegal in a law firm. He reviews cases and writes summaries, cross-referencing them to the clients. He's building expertise in law and is hoping to go to law school in a year. As far as Jacob is concerned, it's the technology that's handicapped, not him. When everything is in place, he can work just as fast and just as effectively as anyone in his office. He's a bit of a gadget geek, always trying out new tools. The last few years have been a lot of fun with all the new apps, and VoiceOver on his Mac and phone lets him use most of them pretty well. He likes the challenge of learning new tools. His other challenge is running. He's training for a 10K run, running with a club in his neighborhood and using an app to plan his routes and track his distance. He's just started to use the iPhone app, Passbook, and uses it to get train tickets and other travel. The regional rail system has an app, so he can just pull up the barcode and scan it at the ticket office. No fumbling for the right printed card- total independence. Same phone as everyone. Same app as everyone, and it all just works.",
      alt: "A man with sunglasses and headphones is sitting at a computer, appearing concentrated on his task.",
    },
    {
      id: 4,
      title: "Living with Fatigue and Pain",
      description:
        "Lea was on track to become the editor of the magazine she worked for when she started having numbness in her hands and feeling completely fatigued by the middle of the afternoon. She tried medications and exercise and getting enough sleep, but finally she had to make a change in her life. She found a job where she could work from home, on her own schedule. When she has good days, it's like nothing is wrong. But on bad days, she measures every action so she can make it through the day. Sometimes that important editorial meeting is all she can manage. She had to adjust her computer: a new keyboard and trackball make it easier to type, and a good chair helps her avoid tender muscles. The biggest change was learning to write and edit using speech recognition software, Dragon Naturally Speaking. She's lucky: the company understands that it's a real disability. With an invisible disability like fibromyalgia, some people just don't get it.",
      alt: "A woman wearing headphones is seated at a desk, engaged with her computer, illustrating a dedicated workspace.",
    },
    {
      id: 5,
      title: "Bilingual Mobile Phone User",
      description:
        "Maria comes from a Mexican family. She grew up helping her family members navigate the English-speaking world. Her work as a community health worker is a natural extension. She does outreach and health education in the Spanish-speaking community in L.A. Her husband bought one computer for home, so their kids can use it for their homework. It's become an important way to keep up with their family back home. They post videos of the children and use Skype to keep up with cousins and friends. Her real lifeline is the smartphone that her family got her last year. Her daughter set up all of her favorite sites in her bookmarks, and she uses the calendar to keep track of her appointments. She isn't sure how it all works, but it's wonderful that it does. She prefers to read in Spanish, especially when she's looking up information that she needs to share with a client in Spanish. Her daughter showed her how to translate a page on the browser. It's not very good, but she can use it to get the general idea of the page contents. Her professional health education has online videos. Captions help her understand the lectures, especially for scientific words.",
      alt: "A group of women engaged in discussion, seated around a table covered with papers and documents.",
    },
    {
      id: 6,
      title: "Deaf, ASL Speaker",
      description:
        "The nice thing about being a graphic artist is that most of the time his work can speak for itself. When Steven first started working, most reviews were done in meetings, but more and more his agency works with clients using online workspaces. He's had some projects recently where all of the communication was through the web. Although he likes seeing live reactions, it's easier for him to participate in the project forum discussions using text rather than audio. His iPhone has also been important. It was his first phone with a good way to do video chat so he could talk to his friends who sign. It's annoying when videos on the web aren't captioned. How is he supposed to learn about a new app if the only information is an animated video? Or if he's the only one in the office who doesn't get the joke? Like many people who learned ASL as their first language, Steven prefers sign, but reads text, since that's most of the web. If a site is just a big wall of text, he's likely to leave unless he knows it's got the information he needs.",
      alt: "A man sits at a table with paper, drawing supplies and a tablet, making a sign with his hand",
    },
    {
      id: 7,
      title: "High School Student with Autism",
      description:
        "Trevor is a bright 18-year-old who plays games and watches videos on his laptop. He lives at home with his parents. He attends a special school where the teachers and staff help with his social and communication challenges from his Autism Spectrum Disorder. He has problems with visual information and recognizing things on the page, and his reading skills are not helped by his trouble concentrating on the page or screen long enough to read. His teachers showed him how to make the text bigger on the page, and told him how to use a printable view to hide all the ads with moving images that distract him, because he reads every word on the page very carefully and literally. He can be easily confused by colloquialisms and metaphors. He can also be overwhelmed by sites that offer too many choices. He likes using the school's forum to talk to his friends. It's easier to just read what they want to say than to listen and try to figure out their facial expressions. He shares a laptop with the family, but has first dibs on it because his parents want him to get his schoolwork done. He uses it for homework, but he really likes games with repetitive actions.",
      alt: "A man intently examines his tablet while holding his hair in his left hand, focused on his task.",
    },
    {
      id: 8,
      title: "Global Citizen with Low Vision",
      description:
        "These days, Singapore is a center of the world, and Vishnu is one of its global citizens. After graduating from one of India's technology colleges, he went to a postgraduate program at the National University of Malaysia. His work on visualizing data landed him a job with a multinational medical technology company. Vishnu was diagnosed with glaucoma and his eyes have been getting steadily worse, despite treatment. He can adjust his monitor and his phone, but many of the technical programs he uses don't have many options, and it can be frustrating to try to keep working when everything gets blurry. His vision problems are a constant challenge. He relies on his screen reader to work with code. Sometimes it's a bit frustrating. His smartphone allows him to interact with the internet and check emails without opening his laptop. His biggest challenge is finding good tools for travel. He needs a good app to show him exactly where he is in a foreign city, as well as to alert him when he’s near a bus stop. And he really wants to go back to India but wonders how he’ll get around once he’s there.",
      alt: "A man engaged in computer work, seated in front of a monitor, concentrating on his tasks.",
    },
    {
      id: 9,
      title: "Online Shopper With Colorblindness",
      description:
        "Lee is colorblind and encounters barriers when shopping online. He has one of the most common visual disabilities that affect men: red and green color blindness. Lee frequently shops online and sometimes encounters problems on websites and with apps where the color contrast of text and images is not adequate and where color alone is used to indicate required fields and sale prices. When red and green color combinations are used, Lee cannot distinguish between the two, since both look brown to him. It is also very difficult for him to make product choices when color swatches are not labeled with the name of the color. Lee has better experiences with online content and apps that use adequate contrast and allow him to adjust contrast settings in his browser. He is also better able to recognize when information is required when asterisks are used. Lee can more easily identify the products he would like to purchase, especially clothing, when the color label names are included in the selection options rather than color swatches alone.",
      alt: "A man with a backpack walks while checking his phone.",
    },
    {
      id: 10,
      title: "Reporter with Repetitive Stress Injury",
      description:
        "Alex has worked as a reporter for 20 years and has developed a repetitive strain injury that makes it painful to use a mouse and to type for a long time. Though it took considerable research and time to learn, he works with less pain in his work environment using: an ergonomic keyboard; keyboard commands without a mouse; voice recognition software on his computer and mobile phone; assistive touch on his phone. Alex encounters problems when websites cannot be navigated by keyboard commands. He frequently encounters web forms that do not have keyboard equivalents. Sometimes it is difficult to skip content and navigate to sections on a webpage without using many keyboard commands, which is tiring and limits the time he can spend working comfortably. Using assistive touch on his phone, helps him use fewer gestures and work longer. Alex's employer has built several custom work arounds that provide keyboard support for his use of the company's internal Content Management System with the intention to implement improved keyboard support to benefit all users on the next release of the software.",
      alt: "A man is focused on drawing on a whiteboard in a professional setting.",
    },
    {
      id: 11,
      title: "Online Student who is Hard of Hearing",
      description:
        "Alex has worked as a reporter for 20 years and has developed a repetitive strain injury that makes it painful to use a mouse and to type for a long time. Though it took considerable research and time to learn, he works with less pain in his work environment using: an ergonomic keyboard; keyboard commands without a mouse; voice recognition software on his computer and mobile phone; assistive touch on his phone. Alex encounters problems when websites cannot be navigated by keyboard commands. He frequently encounters web forms that do not have keyboard equivalents. Sometimes it is difficult to skip content and navigate to sections on a webpage without using many keyboard commands, which is tiring and limits the time he can spend working comfortably. Using assistive touch on his phone, helps him use fewer gestures and work longer. Alex's employer has built several custom work arounds that provide keyboard support for his use of the company's internal Content Management System with the intention to implement improved keyboard support to benefit all users on the next release of the software.",
      alt: "A woman seated at a desk, focused on her laptop, with a pen in hand, engaged in work or study.",
    },
    {
      id: 12,
      title: "Senior Staff Member who is Blind",
      description:
        "Ilya is blind. As the chief accountant at an insurance company, she uses a screen reader and smartphone to access the web. Her screen reader and her phone accessibility features provide her with information about the applications, and text content in a speech output form. When accessing web content, the screen reader reads aloud the structural information of a page, including headings, column and row headers in tables, links, and form controls, enabling her to navigate the page, submit forms, and access information. She listens to and understands speech output at a high speed. Sites that are not properly coded and do not include alt text descriptions on images are unnavigable and require a lot of time to read text from the top of the page to the bottom. Occasionally she finds herself trapped in areas on a page, unable to move to another area. As a senior member of her organization, Ilya provides training to employees using video conferencing, chat, document and slide sharing. Her staff evaluated many tools before finding an application with accessibility features that meet the needs of a staff with diverse abilities.",
      alt: "A silhouette of a woman seated at a computer, wearing headphones, immersed in her work or listening to music.",
    },
    {
      id: 13,
      title:
        "Middle School Student with Atention Deficit Hyperactivity Disorder and Dyslexia",
      description:
        "Preety is a middle school student with attention deficit hyperactivity disorder with dyslexia. She has difficulty reading, but she enjoys her literature class. Her school started using online textbooks. She was initially worried about using this new format, but using text-to-speech software that highlights the text on the screen as it reads it aloud, she realized that she can focus on the content instead of struggling over every word. The text-to-speech software helps with other online text; but, her experience with websites varies. Some sites use graphics in a way that helps her to focus on the content that she would like to read, while other sites have distracting advertisements and moving content. She has problems with online content when the navigation is unclear, and prefers sites that have navigation cues including a navigation bar, search box, bread-crumb trails, and a sitemap. Her school is using an accessible library catalog online. Before it she had to go to the library to find books. Now she can search the catalog using her phone, tablet, or laptop. She struggles with spelling but the search feature that suggests alternative spellings and correct words is helpful.",
      alt: "A girl using her laptop, embodying a moment of concentration.",
    },
    {
      id: 14,
      title:
        "Retiree with Low Vision, Hand Tremor, and Mild Short Term Memory Loss",
      description:
        "Yun is an 85 year-old with reduced vision, hand- tremor, and mild memory loss; common age- related impairments for someone his age. Yun browses the web reading news sites and started using social media to stay in touch with his family and friends. Yun has difficulty reading small text and clicking on small links and form elements. His daughter showed him how to enlarge text in the web browser, which works well on many websites. He encounters problems when text does not reflow when it is enlarged and he is forced to scroll back and forth to read the enlarged content, which means he loses track of his place. He has problems with CAPTCHA images found on many social media sites. The text is so distorted, even when he enlarges it, that he often cannot accurately enter the text. He has a better experience on sites that use alternative CAPTCHA options, unfortunately only a small number currently do. Yun's daughter gave him a special mouse that is easier to control with his hand tremors. He uses a web browser that saves thumbnail images of his frequently visited sites, which makes it easier for him to access the sites he likes.",
      alt: "Two men engaged in a conversation, showcasing their comradery.",
    },
    {
      id: 15,
      title: "Supermarket Assistant with Down Syndrome",
      description:
        "Luis has Down syndrome and has difficulty with abstract concepts, reading, and math. Luis works at a market, bagging groceries for customers. He buys his groceries at the same market where he works, but he is sometimes confused by the large number of product choices. He also has problems finding his favorite items when the store layout changes. Recently, a friend showed him an app for online shopping that has consistent, easy-to- use navigation with clear and direct instructions. Luis is able to add the list of his most frequently purchased items into the app and save it for future purchases. He likes the search functionality that makes suggestions for mistyped words. The app keeps a running total of the items in his shopping cart which helps him keep up with how much he is spending. His friend showed him several accessibility features in his smartphone, including word prediction and the text-to-speech functionality which allows him to listen to reviews posted by other users on the grocery app. Using these tools, Luis has begun posting his reviews online. Now he uses the shopping app for frequently purchased items and buys a few fresh items from the store where he works.",
      alt: "A person with short hair sitting in a chair",
    },
    {
      id: 16,
      title: "Teenager who is Deaf and Blind",
      description:
        "Kaseem is a teenager who is deaf and legally blind. She sees only small portions of a screen and read text when it is large. She uses: screen magnification software to enlarge the text on websites; screen reader software that displays text on a refreshable Braille device; large computer screen with high resolution and high luminosity (brightness). Kaseem's portable electronic Braille notetaker includes e-mail, web browsing, and note-taking functionality. Her smartphone includes GPS which helps her navigate around the city. She uses the public transportation website to plan her trips and view bus schedules, but encounters problems when she enlarges the text and it does not reflow or wrap properly, making the maps difficult to use. She has a better experience viewing the train schedules that are properly marked up and allow text reflow. Kaseem sent a message to the web team informing them of the problems she noticed in their site and described how that site would work better for her. She received an email message thanking her for the information and informing her that the web team will improve the accessibility of their website.",
      alt: "A person with long hair facing a pc screen",
    },
  ];
  const toggleAboutVisibility = () => {
    setIsAboutVisible(!isAboutVisible);
  };

  const toggleInstructionsVisibility = () => {
    setIsInstructionsVisible(!isInstructionsVisible);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollHintVisible(false);
    };

    const personasEl = personasRef.current;
    if (personasEl) {
      personasEl.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (personasEl) {
        personasEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const playTextToSpeech = (text) => {
    try {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = selectedLanguage;
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => console.error("Speech error:", e);

        window.speechSynthesis.cancel();
        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        alert("Your browser does not support text-to-speech functionality.");
      }
    } catch (error) {
      console.error("Error with text-to-speech:", error);
    }
  };

  const stopTextToSpeech = () => {
    if ("speechSynthesis" in window && speechUtteranceRef.current) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        setIsSpeaking(false);
      }
    }
  };

  const handleImageClick = (alt) => {
    setAltText(alt);
  };

  const clearAltText = () => {
    setAltText("");
  };

  const translateContent = async (contentKey, text, lang) => {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2`;

      const response = await axios.post(
        `${url}?key=${KEY}`, 
        {
          q: text,
          target: lang,
          format: "text",
        }
      );

      const translatedText = response.data.data.translations[0].translatedText;
      setTranslations((prev) => ({
        ...prev,
        [contentKey]: Array.isArray(text)
          ? translatedText.split("\n")
          : translatedText,
      }));
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
  
    try {
      const API_KEY = KEY;
      const url = `https://translation.googleapis.com/language/translate/v2`;
  
      const instructionsText = [
        "Choose one card",
        "Read carefully the description of the persona",
        "What accessibility guidelines would you use when developing a website for the user selected?",
        "Consult W3C and list the most appropriate guidelines to make a website design accessible to the user described",
      ];
      const instructionsResponse = await axios.post(`${url}?key=${API_KEY}`, {
        q: instructionsText,
        target: newLanguage,
        format: "text",
      });
  
      const translatedInstructions = instructionsResponse.data.data.translations.map(
        (item) => item.translatedText
      );
  
      const aboutText =
        "The accessibility cards is a set of 16 personas illustrating users with diverse disabilities. The personas include users described in the book «A web for everyone: Designing accessible user experiences» authored by Horton and Quesenbery (2014) and presented in W3C user stories (at: https://www.w3.org/WAI/people-use-web/user-stories/). The contents are shared with creative commons license with attribution. The cards have been developed thanks to the financial support of Teach Access. About Teach Access: Teach Access is a unique collaboration among members of higher education, the technology industry and advocates for accessibility, with a shared goal of making technology broadly accessible by infusing accessibility into higher education, with enhanced training and collaborations with people with disabilities. Teach Access includes members from leading tech companies, academic institutions and disability advocacy organizations and other non-profit institutions. Teach Access operates as a fiscal sponsorship fund at the Silicon Valley Community Foundation (SVCF). To learn more visit teachaccess.org or email info@teachaccess.org.";
      const aboutResponse = await axios.post(`${url}?key=${API_KEY}`, {
        q: aboutText,
        target: newLanguage,
        format: "text",
      });
      const translatedAbout = aboutResponse.data.data.translations[0].translatedText;
  
      const personaDescriptions = personaData.map((persona) => persona.description);
      const personasResponse = await axios.post(`${url}?key=${API_KEY}`, {
        q: personaDescriptions,
        target: newLanguage,
        format: "text",
      });
  
      const translatedPersonas = personasResponse.data.data.translations.map(
        (item) => item.translatedText
      );
  
      setTranslations({
        instructions: translatedInstructions,
        about: translatedAbout,
        personas: translatedPersonas,
      });
    } catch (error) {
      console.error("Error during translation:", error);
    }
  };

  return (
    <div className="App" lang={selectedLanguage}>
      <nav className="Nav">
        <h1 className="Title">Accessibility Cards</h1>
        <div className="AuthorDate">
          <h4 className="Author">Vivian Genaro Motti and Esther Dura</h4>
          <h4 className="Date">2021</h4>
        </div>

        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{ marginBottom: "1rem" }}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>

        <section className="Instructions">
          <button
            className="InstructionsTitle"
            onClick={toggleInstructionsVisibility}
            style={{ cursor: "pointer" }}
          >
            {translations.instructions
              ? "Instructions"
              : "Instructions"}
            <span style={{ marginLeft: "8px" }}>
              {isInstructionsVisible ? "-" : "+"}
            </span>
          </button>
          {isInstructionsVisible && (
            <ul>
              {translations.instructions
                ? translations.instructions.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))
                : [
                    "Choose one card",
                    "Read carefully the description of the persona",
                    "What accessibility guidelines would you use when developing a website for the user selected?",
                    "Consult W3C and list the most appropriate guidelines to make a website design accessible to the user described",
                  ].map((text, i) => <li key={i}>{text}</li>)}
            </ul>
          )}
        </section>

        <section className="About">
          <button
            className="AboutTitle"
            onClick={toggleAboutVisibility}
            style={{ cursor: "pointer" }}
          >
            About
            <span style={{ marginLeft: "8px" }}>
              {isAboutVisible ? "-" : "+"}
            </span>
          </button>
          {isAboutVisible && (
            <p>
              {translations.about ||
                "The card contents are extracted from: Horton, S., &	Quesenbery,	W. (2014). A	web	for	everyone:	Designing	accessible	user	experiences.Rosenfeld	Media. https://www.w3.org/WAI/people-use-web/user-stories/	"}
            </p>
          )}
        </section>
      </nav>

      <main className="Carousel">
        {isScrollHintVisible && (
          <div className="scroll-hint">
            ⇆<br />
            Scroll this way
          </div>
        )}
        <div className="Personas" ref={personasRef}>
          {personaData.map((persona, index) => (
            <div className="PersonaWrapper" key={persona.id}>
              <div className="PersonaContainer">
                <img
                  src={`img/g${index + 1}.png`}
                  alt={persona.alt}
                  onClick={() => handleImageClick(persona.alt)}
                />
                <div className="Persona" id={persona.id}>
                  <div className="PersonaTitle">
                    <button
                      onClick={() =>
                        playTextToSpeech(
                          translations.personas?.[index] || persona.description
                        )
                      }
                      className="PlayButton"
                    >
                      ▶
                    </button>
                    <button
                      onClick={stopTextToSpeech}
                      className="PlayButton"
                      style={{ marginLeft: "8px" }}
                    >
                      ◼
                    </button>
                    <h4>{persona.title}</h4>
                  </div>
                  {altText && (
                    <div className="AltTextDisplay" onClick={clearAltText}>
                      <p>{altText}</p>
                    </div>
                  )}
                  <p>{translations.personas?.[index] || persona.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
