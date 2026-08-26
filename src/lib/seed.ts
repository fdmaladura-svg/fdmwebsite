import { sql } from "drizzle-orm";
import { db } from "../db";
import {
  adminUsers,
  settings,
  pageSections,
  navigationItems,
  announcements,
  serviceSchedules,
  events,
  ministries,
  leaders,
  sermons,
  devotionals,
  galleryAlbums,
  galleryMedia,
  ksmCourses,
  vocationalCourses,
  givingCategories,
  testimonies,
} from "../db/schema";
import { hashPassword } from "./auth";
import { doxaDates, operation77Dates, settleMeDates, toISODate } from "./dates";

async function isEmpty(table: string) {
  const res = await db.execute(sql.raw(`select count(*)::int as c from ${table}`));
  const rows = res.rows as { c: number }[];
  return (rows[0]?.c ?? 0) === 0;
}

async function countAll(tables: string[]) {
  const counts: Record<string, number> = {};
  for (const t of tables) {
    try {
      const res = await db.execute(sql.raw(`select count(*)::int as c from ${t}`));
      counts[t] = Number((res.rows as { c: number }[])[0]?.c ?? 0);
    } catch {
      counts[t] = -1;
    }
  }
  return counts;
}

export async function seedDatabase() {
  const year = new Date().getFullYear();

  if (await isEmpty("admin_users")) {
    await db.insert(adminUsers).values([
      {
        name: "Church Administrator",
        email: "admin@faithdynamite.org",
        passwordHash: hashPassword("FaithDynamite2026!"),
        role: "super_admin",
      },
      {
        name: "Content Editor",
        email: "editor@faithdynamite.org",
        passwordHash: hashPassword("Editor2026!"),
        role: "editor",
      },
    ]);
  }

  if (await isEmpty("settings")) {
    await db.insert(settings).values([
      {
        key: "church",
        value: {
          name: "Faith Dynamite Ministries (Aladura)",
          affiliation: "A member of Cherubim and Seraphim Movement Church (Ayo Ni O)",
          tagline: "Where Faith Works Wonders",
          address: "",
          phone: "0707 000 0336",
          whatsapp: "08035707000",
          email: "",
          officeHours: "Monday – Friday, 9:00 AM – 4:00 PM",
          mapEmbedUrl: "",
          logoUrl: "/images/fdm-logo.png",
          affiliationLogoUrl: "/images/cs-logo.png",
          ksmLogoUrl: "/images/ksm-logo.png",
        },
      },
      { key: "social", value: { facebook: "", instagram: "", youtube: "", tiktok: "", whatsapp: "", x: "" } },
      {
        key: "live",
        value: {
          isLive: false,
          youtubeUrl: "",
          facebookUrl: "",
          embedUrl: "",
          offlineMessage: "We're currently offline. Watch our latest message while you wait.",
        },
      },
      {
        key: "bank",
        value: {
          enabled: true,
          bankName: "To be provided by the church administrator",
          accountName: "To be provided by the church administrator",
          accountNumber: "To be provided by the church administrator",
          instructions:
            "Please use your full name and giving purpose as the transfer narration, then send your proof of payment to the church office.",
        },
      },
      {
        key: "ksm",
        value: {
          admissionOpen: true,
          tuitionFree: true,
          online: true,
          enquiryPhones: "0707 000 0336, 0803 570 7000",
          venue: "Online (Global Access)",
        },
      },
    ]);
  }

  if (await isEmpty("navigation_items")) {
    const header = [
      ["Home", "/"],
      ["About", "/about"],
      ["Worship", "/worship"],
      ["Ministries", "/ministries"],
      ["Events", "/events"],
      ["School of Ministry", "/school-of-ministry"],
      ["Vocational Training", "/vocational-training"],
      ["Sermons", "/sermons"],
      ["Media", "/gallery"],
      ["Give", "/give"],
      ["Contact", "/contact"],
    ];
    const footer = [
      ["About", "/about"],
      ["Ministries", "/ministries"],
      ["Events", "/events"],
      ["Sermons", "/sermons"],
      ["KSM", "/school-of-ministry"],
      ["Vocational Training", "/vocational-training"],
      ["Give", "/give"],
      ["Contact", "/contact"],
    ];
    await db.insert(navigationItems).values([
      ...header.map(([label, href], i) => ({ label, href, location: "header", sortOrder: i })),
      ...footer.map(([label, href], i) => ({ label, href, location: "footer", sortOrder: i })),
    ]);
  }

  if (await isEmpty("announcements")) {
    await db.insert(announcements).values([
      { message: "Welcome to Faith Dynamite Ministries — Where Faith Works Wonders", linkUrl: "/about", sortOrder: 0 },
      { message: "KATARTISMOS School of Ministry — Admission is now open. Tuition free, 100% online.", linkUrl: "/school-of-ministry/apply", sortOrder: 1 },
      { message: "Voice of Mercy Speaks — receive today's prophetic word", linkUrl: "/voice-of-mercy", sortOrder: 2 },
    ]);
  }

  if (await isEmpty("page_sections")) {
    await db.insert(pageSections).values([
      {
        page: "home",
        sectionKey: "hero",
        label: "Homepage Hero",
        eyebrow: "Faith Dynamite Ministries (Aladura)",
        title: "Where Faith Works Wonders",
        subtitle: "Raising Kingdom Ambassadors. Transforming Lives. Advancing the Kingdom of God.",
        body: "Encounter God. Grow in His Word. Discover your purpose. Become equipped to impact your generation.",
        imageUrl: "/images/hero-worship.jpg",
        ctaLabel: "Join Us This Sunday",
        ctaUrl: "/plan-your-visit",
        cta2Label: "Watch Online",
        cta2Url: "/watch-live",
        sortOrder: 1,
      },
      {
        page: "home",
        sectionKey: "welcome",
        label: "Welcome Section",
        eyebrow: "Welcome Home",
        title: "You Are Welcome Here",
        subtitle: "A place of prayer, worship, biblical teaching, spiritual growth and Kingdom empowerment.",
        body: "Faith Dynamite Ministries is a place of prayer, worship, biblical teaching, spiritual growth and Kingdom empowerment. Whether you are searching for a church family, seeking deeper knowledge of God's Word, pursuing ministry training or developing practical skills for life, there is a place for you here.",
        imageUrl: "/images/aladura-prayer.jpg",
        ctaLabel: "Discover Our Story",
        ctaUrl: "/about",
        sortOrder: 2,
      },
      {
        page: "home",
        sectionKey: "services",
        label: "Weekly Service Times",
        eyebrow: "Gather With Us",
        title: "Weekly Activities",
        subtitle: "Come as you are. There is always a place for you at our altar.",
        sortOrder: 3,
      },
      {
        page: "home",
        sectionKey: "programmes",
        label: "Special Programmes",
        eyebrow: "Special Programmes",
        title: "Experience God With Us",
        subtitle: "Divine encounters that mark seasons, silence storms and settle destinies.",
        sortOrder: 4,
      },
      {
        page: "home",
        sectionKey: "mission",
        label: "About / Our Mission",
        eyebrow: "Our Mission",
        title: "Empowering the Whole Person for Kingdom and Societal Impact",
        body: "We exist to lead people to Jesus Christ, teach the undiluted Word of God, nurture a culture of fervent prayer and Spirit-led worship, disciple believers into maturity, and empower families and communities both spiritually and practically.",
        imageUrl: "/images/choir.jpg",
        ctaLabel: "About Our Ministry",
        ctaUrl: "/about",
        sortOrder: 5,
      },
      { page: "home", sectionKey: "ministries", label: "Ministries Section", eyebrow: "Serve & Belong", title: "Our Ministries", subtitle: "Find your place in the family and grow in the gift God has given you.", sortOrder: 6 },
      { page: "home", sectionKey: "voice", label: "Voice of Mercy Section", eyebrow: "Prophetic Devotionals", title: "Voice of Mercy Speaks", subtitle: "Daily prophetic words, scripture reflections and prayer declarations.", sortOrder: 7 },
      { page: "home", sectionKey: "sermons", label: "Latest Sermons", eyebrow: "The Word", title: "Latest Messages", subtitle: "Sound biblical teaching to build your faith through the week.", sortOrder: 8 },
      {
        page: "home",
        sectionKey: "ksm",
        label: "School of Ministry Section",
        eyebrow: "KATARTISMOS School of Ministry",
        title: "Equipping Saints. Transforming Lives. Advancing the Kingdom.",
        body: "Tuition free. 100% online. Learn from anywhere in the world and be released for impactful Kingdom service.",
        imageUrl: "/images/ksm-learning.jpg",
        ctaLabel: "Explore KSM",
        ctaUrl: "/school-of-ministry",
        cta2Label: "Apply Now",
        cta2Url: "/school-of-ministry/apply",
        sortOrder: 9,
      },
      {
        page: "home",
        sectionKey: "vocational",
        label: "Vocational Empowerment Section",
        eyebrow: "Vocational Empowerment",
        title: "Skills For Life",
        subtitle: "Spiritual empowerment. Practical empowerment. Sustainable lives.",
        body: "Beyond the altar, Faith Dynamite Ministries is committed to equipping members and the wider community with practical vocational, digital and entrepreneurial skills for dignified, sustainable living.",
        imageUrl: "/images/vocational.jpg",
        ctaLabel: "See Training Programmes",
        ctaUrl: "/vocational-training",
        sortOrder: 10,
      },
      { page: "home", sectionKey: "events", label: "Upcoming Events", eyebrow: "What's Happening", title: "Upcoming Events", subtitle: "Mark your calendar and journey with us.", sortOrder: 11 },
      { page: "home", sectionKey: "gallery", label: "Recent Gallery", eyebrow: "Moments", title: "Recent Gallery", subtitle: "Glimpses of grace from our gatherings.", sortOrder: 12 },
      { page: "home", sectionKey: "testimonies", label: "Testimonies", eyebrow: "Wonders", title: "Faith Works Wonders", subtitle: "Testimonies from our family of faith.", sortOrder: 13 },
      {
        page: "home",
        sectionKey: "giving",
        label: "Giving CTA",
        eyebrow: "Partnership",
        title: "Give With Purpose",
        body: "Partner with what God is doing through Faith Dynamite Ministries.",
        ctaLabel: "Give Online",
        ctaUrl: "/give",
        sortOrder: 14,
      },
      {
        page: "home",
        sectionKey: "visit",
        label: "Plan Your Visit CTA",
        eyebrow: "First Time?",
        title: "Plan Your Visit",
        body: "We would love to welcome you and your family. Tell us you are coming and we will be expecting you.",
        imageUrl: "/images/youth-ministry.jpg",
        ctaLabel: "I'm Coming This Sunday",
        ctaUrl: "/plan-your-visit",
        sortOrder: 15,
      },
      {
        page: "home",
        sectionKey: "newsletter",
        label: "Newsletter / WhatsApp CTA",
        eyebrow: "Stay Connected",
        title: "Join Our WhatsApp Community",
        body: "Receive Voice of Mercy Speaks, service reminders and programme updates.",
        ctaLabel: "Contact Us",
        ctaUrl: "/contact",
        sortOrder: 16,
      },
      {
        page: "about",
        sectionKey: "hero",
        label: "About Hero",
        eyebrow: "About Us",
        title: "Who We Are",
        subtitle: "Faith Dynamite Ministries (Aladura) — a member of Cherubim and Seraphim Movement Church (Ayo Ni O).",
        body: "Faith Dynamite Ministries (Aladura) is a Christian ministry rooted in the finished work of Jesus Christ, the authority of the Holy Scriptures and the power of the Holy Spirit. We are a praying people, a worshipping people and a people committed to raising Kingdom ambassadors who impact their generation.\n\nOur gatherings blend the rich prayer heritage of the Aladura tradition with sound biblical teaching and Spirit-led contemporary worship, so that every believer — young or old, new or seasoned — can encounter God and grow.",
        imageUrl: "/images/aladura-prayer.jpg",
        sortOrder: 1,
      },
      { page: "about", sectionKey: "vision", label: "Our Vision", title: "Our Vision", body: "To be a Spirit-filled community of faith raising Kingdom ambassadors who are biblically grounded, spiritually mature, practically empowered and released to transform lives, families, communities and nations for the glory of God.", sortOrder: 2 },
      { page: "about", sectionKey: "mission", label: "Our Mission", title: "Our Mission", body: "To lead people to Jesus Christ; to teach the Word of God faithfully; to cultivate fervent prayer and heartfelt worship; to disciple believers into Christlike maturity; to equip saints for ministry through the KATARTISMOS School of Ministry; and to empower lives practically through vocational training, compassion and community outreach.", sortOrder: 3 },
      { page: "about", sectionKey: "heritage", label: "Our Heritage", eyebrow: "Our Heritage", title: "Cherubim & Seraphim Movement Church — Ayo Ni O", body: "Faith Dynamite Ministries is a member of the Cherubim and Seraphim Movement Church (Ayo Ni O), a historic Aladura movement known for fervent prayer, prophetic ministry, holiness and reverent worship. We honour this heritage while remaining a warm, welcoming, Christ-centred ministry for people of every background.", imageUrl: "/images/cs-logo.png", sortOrder: 4 },
      { page: "about", sectionKey: "leadership", label: "Leadership Intro", eyebrow: "Our Team", title: "Our Leadership", body: "Our leadership profiles will be published here shortly. Please check back soon.", sortOrder: 5 },
      { page: "give", sectionKey: "hero", label: "Giving Hero", eyebrow: "Giving", title: "Give With Purpose", subtitle: "Partner with what God is doing through Faith Dynamite Ministries.", body: "Every seed sown supports worship, discipleship, ministry training, welfare and the empowerment of lives across our community.", sortOrder: 1 },
      { page: "visit", sectionKey: "hero", label: "Plan Your Visit Hero", eyebrow: "First Time Here?", title: "Plan Your Visit", subtitle: "We cannot wait to welcome you.", body: "Whether you are visiting Nigeria's finest Aladura worship for the first time or returning after many years, you will find a warm family, reverent worship and a Word that speaks to your situation.", imageUrl: "/images/youth-ministry.jpg", sortOrder: 1 },
      { page: "visit", sectionKey: "expect", label: "What To Expect", title: "What To Expect", body: "Expect heartfelt worship, fervent prayer, the reading and teaching of the Scriptures, prophetic ministration and a warm welcome from our hospitality team. Services typically last about two hours.", sortOrder: 2 },
      { page: "visit", sectionKey: "wear", label: "What To Wear", title: "What To Wear", body: "Come as you are — modest and comfortable. Many of our members worship in white garments in keeping with our Aladura heritage, while others come in traditional or contemporary attire. You are welcome either way.", sortOrder: 3 },
      { page: "visit", sectionKey: "children", label: "Children & Family", title: "Children & Family", body: "Children are a heritage of the Lord. Our children's church runs alongside the main service with trained teachers, and our ushers will gladly help your family settle in.", sortOrder: 4 },
      { page: "visit", sectionKey: "directions", label: "Directions & Parking", title: "Directions & Parking", body: "Our full address and parking directions will be published here by the church administrator. Please contact the church office for directions in the meantime.", sortOrder: 5 },
      { page: "ksm", sectionKey: "hero", label: "KSM Hero", eyebrow: "Ephesians 4:11–16", title: "KATARTISMOS School of Ministry", subtitle: "Equipping Saints. Transforming Lives. Advancing the Kingdom.", body: "EQUIP • ESTABLISH • EDIFY • EMPOWER", imageUrl: "/images/ksm-learning.jpg", ctaLabel: "Apply For Admission", ctaUrl: "/school-of-ministry/apply", cta2Label: "View Curriculum", cta2Url: "/school-of-ministry#curriculum", sortOrder: 1 },
      { page: "ksm", sectionKey: "admission", label: "Admission Section", eyebrow: "Admissions", title: "Admission Now Open", body: "Do you believe God has called you into ministry? Do you desire to know God's Word more deeply? Do you want to discover, develop and deploy your spiritual gifts? Then KATARTISMOS School of Ministry is for you. We are committed to raising believers who are spiritually mature, biblically grounded and equipped for impactful Kingdom service.", sortOrder: 2 },
      { page: "vocational", sectionKey: "hero", label: "Vocational Hero", eyebrow: "Vocational Empowerment", title: "Skills For Life", subtitle: "Spiritual empowerment. Practical empowerment. Sustainable lives.", body: "Faith Dynamite Ministries seeks to equip members and the wider community with practical vocational and entrepreneurial skills, so that faith is expressed in dignified work and sustainable livelihoods.", imageUrl: "/images/vocational.jpg", sortOrder: 1 },
      { page: "contact", sectionKey: "hero", label: "Contact Hero", eyebrow: "Say Hello", title: "Contact Us", subtitle: "We would love to hear from you.", sortOrder: 1 },
    ]);
  }

  if (await isEmpty("service_schedules")) {
    await db.insert(serviceSchedules).values([
      { title: "Sunday School", dayOfWeek: 0, startTime: "08:00", timeLabel: "8:00 AM", dayLabel: "Sunday", frequency: "weekly", description: "Systematic study of the Word for all ages.", icon: "book", sortOrder: 1 },
      { title: "Sunday Worship Service", dayOfWeek: 0, startTime: "09:00", timeLabel: "9:00 AM", dayLabel: "Sunday", frequency: "weekly", description: "Our main celebration service — worship, the Word and prophetic ministration.", icon: "church", sortOrder: 2 },
      { title: "Midweek Service", dayOfWeek: 3, startTime: "17:30", timeLabel: "5:30 PM", dayLabel: "Wednesday", frequency: "weekly", description: "Midweek refreshing, teaching and intercession.", icon: "flame", sortOrder: 3 },
      { title: "Vigil", dayOfWeek: 5, startTime: "22:00", timeLabel: "10:00 PM", dayLabel: "2nd & Last Friday", frequency: "second_last", description: "Night of prayer, warfare and prophetic encounter.", icon: "moon", sortOrder: 4 },
      { title: "Anointing Service", dayOfWeek: 0, startTime: "09:00", timeLabel: "9:00 AM", dayLabel: "First Sunday monthly", frequency: "first_dow", description: "Monthly anointing, consecration and impartation service.", icon: "oil", sortOrder: 5 },
    ]);
  }

  if (await isEmpty("events")) {
    const doxa = doxaDates(year);
    const op77 = operation77Dates(year);
    const settle = settleMeDates(year, new Date().getMonth());
    await db.insert(events).values([
      {
        title: "DOXA — The Throne of Glory",
        slug: "doxa-the-throne-of-glory",
        category: "Annual Programme",
        summary: "40 Days of Glory — from the last Monday in October to the first Friday in December.",
        description:
          "DOXA — The Throne of Glory is our annual 40 Days of Glory: a sustained season of prayer, worship, the Word and divine encounters. Each day carries a prophetic focus as the ministry ascends together into the presence of God, believing for glory, restoration, testimonies and open doors.",
        bannerUrl: "/images/aladura-prayer.jpg",
        startDate: toISODate(doxa.start),
        endDate: toISODate(doxa.end),
        startTime: "18:00",
        venue: "Faith Dynamite Ministries",
        locationType: "hybrid",
        theme: "40 Days of Glory",
        scripture: "Psalm 24:7–10",
        recurrence: "annual",
        isProgramme: true,
        featured: true,
      },
      {
        title: "Operation 7:7 — Ipade Alasepe (Perfection Congress)",
        slug: "operation-7-7-perfection-congress",
        category: "Annual Programme",
        summary: "7 Days of Prayer • Worship • Word • Divine Encounters — July 1 to July 7 every year.",
        description:
          "Operation 7:7, our Ipade Alasepe (Perfection Congress), runs from the 1st to the 7th of July every year. Seven consecutive days of prayer, worship, the Word and divine encounters, believing God for perfection in every unfinished area of our lives, families and ministries.",
        bannerUrl: "/images/hero-worship.jpg",
        startDate: toISODate(op77.start),
        endDate: toISODate(op77.end),
        startTime: "17:00",
        venue: "Faith Dynamite Ministries",
        locationType: "hybrid",
        theme: "Perfection Congress",
        scripture: "Psalm 138:8",
        recurrence: "annual",
        isProgramme: true,
        featured: true,
      },
      {
        title: "Operation Settle Me By Mercy",
        slug: "operation-settle-me-by-mercy",
        category: "Quarterly Programme",
        summary: "A three-day prayer encounter: the last day of the selected month plus the first two days of the new month.",
        description:
          "Operation Settle Me By Mercy is our quarterly three-day prayer encounter. It spans the last day of the selected month and the first two days of the new month — a season of crossing over, divine settlement and mercy speaking on behalf of every worshipper. The administrator selects the months in which each quarter's edition holds.",
        bannerUrl: "/images/choir.jpg",
        startDate: toISODate(settle.start),
        endDate: toISODate(settle.end),
        startTime: "22:00",
        venue: "Faith Dynamite Ministries",
        locationType: "hybrid",
        theme: "Divine Settlement by Mercy",
        scripture: "Psalm 102:13",
        recurrence: "quarterly",
        isProgramme: true,
        featured: true,
      },
      {
        title: "Thanksgiving & Anointing Service",
        slug: "monthly-anointing-service",
        category: "Monthly Service",
        summary: "First Sunday of every month — consecration, anointing and impartation.",
        description: "Join us on the first Sunday of every month for our anointing service — a time of consecration, thanksgiving and fresh impartation for the new month.",
        bannerUrl: "/images/choir.jpg",
        startDate: toISODate(new Date(year, new Date().getMonth() + 1, 1)),
        startTime: "09:00",
        venue: "Faith Dynamite Ministries",
        locationType: "onsite",
        recurrence: "monthly",
        featured: false,
      },
    ]);
  }

  if (await isEmpty("ministries")) {
    const list = [
      ["Prayer Ministry", "prayer-ministry", "Intercessors standing in the gap for the church, families and the nation.", "/images/aladura-prayer.jpg", "Weekly intercession before every service"],
      ["Worship & Choir", "worship-choir", "Leading the congregation into Spirit-led worship with excellence and reverence.", "/images/choir.jpg", "Rehearsals every Saturday"],
      ["Men's Ministry", "mens-ministry", "Raising godly men who lead their homes, workplaces and communities with integrity.", "/images/hero-worship.jpg", "Monthly fellowship"],
      ["Women's Ministry", "womens-ministry", "Nurturing women of prayer, virtue, purpose and enterprise.", "/images/aladura-prayer.jpg", "Monthly fellowship"],
      ["Youth Ministry", "youth-ministry", "Empowering young people to live boldly for Christ in their generation.", "/images/youth-ministry.jpg", "Every Sunday after service"],
      ["Children's Ministry", "childrens-ministry", "Teaching children the Word of God in a safe, joyful environment.", "/images/youth-ministry.jpg", "Sundays during main service"],
      ["Evangelism & Missions", "evangelism-missions", "Taking the gospel beyond our walls to streets, campuses and communities.", "/images/hero-worship.jpg", "Monthly outreach"],
      ["Welfare & Community Outreach", "welfare-outreach", "Extending the compassion of Christ to the vulnerable within and beyond the church.", "/images/vocational.jpg", "Ongoing"],
      ["Media Ministry", "media-ministry", "Capturing and broadcasting the move of God through sound, video and digital platforms.", "/images/ksm-learning.jpg", "Every service"],
    ];
    await db.insert(ministries).values(
      list.map(([name, slug, description, imageUrl, meetingInfo], i) => ({
        name,
        slug,
        description,
        imageUrl,
        meetingInfo,
        body: `${description} Contact the church office to join or learn more about the ${name}.`,
        sortOrder: i,
      })),
    );
  }

  if (await isEmpty("leaders")) {
    await db.insert(leaders).values([
      {
        name: "Prophetess Temitope Afolabi-Adebisi (AjaraEmi)",
        title: "Voice of Mercy Speaks",
        shortBio: "Associated with the Voice of Mercy Speaks prophetic devotional ministry of Faith Dynamite Ministries.",
        fullBio: "Biography to be supplied by the church administrator.",
        photoUrl: "/images/voice-of-mercy.jpg",
        sortOrder: 1,
      },
    ]);
  }

  if (await isEmpty("sermons")) {
    const today = new Date();
    const d = (offset: number) => toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset));
    await db.insert(sermons).values([
      { title: "The Voice That Silences Storms", slug: "the-voice-that-silences-storms", speaker: "Prophetess Temitope Afolabi-Adebisi (AjaraEmi)", sermonDate: d(3), scripture: "Mark 4:39–41", series: "Greater Things", description: "The storm may be raging, but Jesus is still in your boat. His voice is greater than every crisis, opposition, delay and uncertainty.", thumbnailUrl: "/images/voice-of-mercy.jpg", featured: true },
      { title: "The Lord Who Goes Before You", slug: "the-lord-who-goes-before-you", speaker: "Prophetess Temitope Afolabi-Adebisi (AjaraEmi)", sermonDate: d(10), scripture: "Deuteronomy 31:8", series: "Greater Things", description: "You are not walking into your future alone — God is already there, preparing the way before you arrive.", thumbnailUrl: "/images/hero-worship.jpg" },
      { title: "Where Faith Works Wonders", slug: "where-faith-works-wonders", speaker: "Faith Dynamite Ministries", sermonDate: d(17), scripture: "Hebrews 11:1–6", series: "Foundations of Faith", description: "Faith is not a feeling; it is a substance. Learn how living faith produces wonders in ordinary lives.", thumbnailUrl: "/images/choir.jpg" },
    ]);
  }

  if (await isEmpty("devotionals")) {
    const today = new Date();
    const d = (offset: number) => toISODate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset));
    await db.insert(devotionals).values([
      {
        title: "The Voice That Silences Storms",
        slug: "the-voice-that-silences-storms",
        scripture: "Mark 4:39–41",
        excerpt: "Beloved, the storm may be raging, but Jesus is still in your boat! His voice is greater than every crisis, opposition, delay and uncertainty.",
        body: "Beloved, the storm may be raging, but Jesus is still in your boat! His voice is greater than every crisis, opposition, delay and uncertainty.\n\nI PROPHESY: Every storm disturbing your peace is becoming STILL! Every raging battle is coming under divine control, and you shall cross over safely into your season of GREATER THINGS!\n\nFear not. Jesus is speaking peace over your life!\n\nDeclare it today: \"THE STORM IS SILENCED, MY PEACE IS RESTORED, AND MY TESTIMONY SHALL SPEAK!\"\n\nIn Jesus' mighty Name. Amen!",
        imageUrl: "/images/voice-of-mercy.jpg",
        category: "Prophecy",
        publishDate: d(1),
        featured: true,
      },
      {
        title: "The Lord Who Goes Before You",
        slug: "the-lord-who-goes-before-you",
        scripture: "Deuteronomy 31:8",
        excerpt: "You may not know what tomorrow holds, but God is already there. The God who goes before you is already preparing the way.",
        body: "\"And the LORD, he it is that doth go before thee; he will be with thee, he will not fail thee, neither forsake thee: fear not, neither be dismayed.\" — Deuteronomy 31:8\n\nBeloved, you are not walking into your future alone — God is already there! Before you arrive at that door, opportunity, relationship or assignment, the Lord has gone ahead to prepare the way.\n\nI PROPHESY: Every obstacle ahead of you is giving way! Divine favour will go before you, helpers will locate you, doors will open, and every crooked path shall become straight. You will arrive at your appointed place with evidence that GOD WENT BEFORE YOU!\n\nFear not. Move forward. Your path is prepared!\n\nThe Lord goes before you. The Lord is with you. The Lord will not fail you. GREATER THINGS await you!",
        imageUrl: "/images/voice-of-mercy.jpg",
        category: "Faith",
        publishDate: d(2),
        featured: true,
      },
      {
        title: "I Will Not Fear Tomorrow",
        slug: "i-will-not-fear-tomorrow",
        scripture: "Deuteronomy 31:8",
        excerpt: "A declaration for every believer stepping into a new season.",
        body: "I DECLARE: I will not fear tomorrow, because my God is already there.\n\nThe Lord goes before me, the Lord is with me, and the Lord will bring me into GREATER THINGS!\n\n#Deuteronomy31:8",
        imageUrl: "/images/voice-of-mercy.jpg",
        category: "Victory",
        publishDate: d(3),
      },
    ]);
  }

  if (await isEmpty("gallery_albums")) {
    const albums = [
      ["Sunday Worship", "sunday-worship", "/images/hero-worship.jpg"],
      ["Special Programmes", "special-programmes", "/images/aladura-prayer.jpg"],
      ["Choir & Worship", "choir-and-worship", "/images/choir.jpg"],
      ["KATARTISMOS School of Ministry", "ksm", "/images/ksm-learning.jpg"],
      ["Vocational Training", "vocational-training", "/images/vocational.jpg"],
      ["Youth & Children", "youth-and-children", "/images/youth-ministry.jpg"],
      ["Voice of Mercy", "voice-of-mercy", "/images/voice-of-mercy.jpg"],
    ];
    const inserted = await db
      .insert(galleryAlbums)
      .values(albums.map(([title, slug, coverUrl], i) => ({ title, slug, coverUrl, description: `${title} photo album.`, sortOrder: i })))
      .returning();
    const media = inserted.flatMap((album) => [
      { albumId: album.id, url: album.coverUrl!, caption: album.title, sortOrder: 0 },
      { albumId: album.id, url: "/images/hero-worship.jpg", caption: "Congregational worship", sortOrder: 1 },
      { albumId: album.id, url: "/images/choir.jpg", caption: "Choir ministration", sortOrder: 2 },
      { albumId: album.id, url: "/images/aladura-prayer.jpg", caption: "Prayer altar", sortOrder: 3 },
    ]);
    await db.insert(galleryMedia).values(media);
  }

  if (await isEmpty("ksm_courses")) {
    const courses = [
      ["Biblical Foundations", "Understand the structure, storyline and sound interpretation of the Scriptures."],
      ["Prayer & Spiritual Growth", "Build a consistent, Spirit-led prayer life and grow in personal devotion."],
      ["The Holy Spirit & Spiritual Gifts", "Discover the person, power and gifts of the Holy Spirit in ministry."],
      ["Christian Leadership", "Servant leadership principles for ministry and marketplace impact."],
      ["Evangelism & Missions", "Practical soul winning, follow-up and missions strategy."],
      ["Prophetic Ministry", "Biblical foundations, accuracy, order and integrity in prophetic ministry."],
      ["Church Administration", "Systems, stewardship and structure for a healthy local assembly."],
      ["Ministry Ethics", "Character, accountability and conduct becoming of a minister of Christ."],
      ["Discipleship", "Making disciples who make disciples, following the pattern of Christ."],
      ["Christian Character", "Fruit of the Spirit, holiness and Christlikeness in daily living."],
      ["Practical Ministry", "Hands-on ministry: counselling, altar work, visitation and service."],
    ];
    await db.insert(ksmCourses).values(courses.map(([title, description], i) => ({ title, description, sortOrder: i })));
  }

  if (await isEmpty("vocational_courses")) {
    const courses = [
      ["ICT & Digital Skills", "Computer literacy, productivity tools and essential digital skills."],
      ["Graphic Design", "Design fundamentals and industry tools for print and digital media."],
      ["Photography & Videography", "Capturing, editing and monetising visual stories."],
      ["Web Design", "Build modern, responsive websites from scratch."],
      ["Tailoring & Fashion Design", "Pattern drafting, sewing and fashion entrepreneurship."],
      ["Catering & Baking", "Commercial cooking, baking and small food business skills."],
      ["Hairdressing & Beauty", "Professional beauty and salon business training."],
      ["Electrical Installation", "Safe domestic and commercial electrical installation practice."],
      ["Solar Installation", "Solar system design, installation and maintenance."],
      ["Entrepreneurship & Business Skills", "Starting, funding and growing a sustainable small business."],
    ];
    await db.insert(vocationalCourses).values(
      courses.map(([title, description], i) => ({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description,
        imageUrl: "/images/vocational.jpg",
        duration: "To be announced",
        isFree: true,
        status: "draft",
        registrationOpen: false,
        sortOrder: i,
      })),
    );
  }

  if (await isEmpty("giving_categories")) {
    const cats = [
      "Tithe",
      "Offering",
      "Thanksgiving",
      "Missions",
      "Welfare / Benevolence",
      "Building / Project",
      "School of Ministry",
      "Vocational Empowerment",
      "Special Programme",
      "Other",
    ];
    await db.insert(givingCategories).values(cats.map((name, i) => ({ name, sortOrder: i })));
  }

  if (await isEmpty("testimonies")) {
    await db.insert(testimonies).values([
      { name: "Sister Adebola", body: "I came into this ministry burdened and confused. After the prayer of mercy, God settled my case within one month. Faith truly works wonders!", permission: true, status: "approved" },
      { name: "Brother Emeka", body: "During Operation 7:7 last year, God turned my business around. What was delayed for three years was released in seven days.", permission: true, status: "approved" },
    ]);
  }

  return countAll([
    "admin_users",
    "settings",
    "page_sections",
    "navigation_items",
    "announcements",
    "service_schedules",
    "events",
    "ministries",
    "leaders",
    "sermons",
    "devotionals",
    "gallery_albums",
    "gallery_media",
    "ksm_courses",
    "vocational_courses",
    "giving_categories",
    "testimonies",
  ]);
}
