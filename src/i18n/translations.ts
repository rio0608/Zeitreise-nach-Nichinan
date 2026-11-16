export type Language = 'ja' | 'en' | 'zh';

export interface SpotTranslation {
  name: string;
  categoryLabel: string;
  area: string;
  description: string;
  daytimeHighlight: string;
  nighttimeHighlight: string;
  hours: string;
  nightHours?: string;
  tags: string[];
  reservationOptions?: string[];
}

export const SPOT_TRANSLATIONS: Record<string, Record<'en' | 'zh', SpotTranslation>> = {
  'spot-sunmesse': {
    en: {
      name: 'Sunmesse Nichinan',
      categoryLabel: 'Scenic View & Moai',
      area: 'Nichinan Coast Area',
      description:
        'The only place in the world with 7 officially recognized full replicas of Easter Island Moai statues, set on a panoramic green hill overlooking the azure Pacific Ocean.',
      daytimeHighlight:
        'Marvel at the 7 giant Moai statues standing against the deep blue Pacific ocean with rolling hills and panoramic sea vistas!',
      nighttimeHighlight:
        'At dusk, capture dramatic silhouettes of the Moai statues against the crimson horizon during magic hour.',
      hours: '09:30 - 17:00 (Last entry 16:30)',
      tags: ['Moai Statues', 'Ocean View', 'Power Spot', 'Cart Drive'],
      reservationOptions: [
        'General Admission',
        'Admission + Priority Park Round Cart (+¥800)',
        'Admission + Special Moai Soft-serve (+¥400)',
      ],
    },
    zh: {
      name: '日南太阳花园（Sunmesse Nichinan）',
      categoryLabel: '绝景・复活节摩艾石像',
      area: '日南海岸地区',
      description:
        '全球唯一获得复活节岛官方正式授权完整复刻的7尊巨石摩艾像，矗立在俯瞰浩瀚太平洋的葱翠丘陵上，是日南最具代表性的象征景点。',
      daytimeHighlight:
        '以深蓝太平洋为背景排开的7尊复刻摩艾石像，以及辽阔无际的南国全景大草原！',
      nighttimeHighlight:
        '黄昏时分，摩艾石像的剪影映照在绯红水平线上，是令人赞叹的绝美摄影时段。',
      hours: '09:30 - 17:00（最后入园 16:30）',
      tags: ['摩艾石像', '海景全景', '能量景点', '游园电瓶车'],
      reservationOptions: [
        '普通门票',
        '门票＋园内游览电瓶车优先保障（+800日元）',
        '门票＋摩艾特制冰淇淋（+400日元）',
      ],
    },
  },
  'spot-udo-shrine': {
    en: {
      name: 'Udo Shrine',
      categoryLabel: 'Historic Cave Shrine',
      area: 'Nichinan Coast Area',
      description:
        'An extraordinary Shinto shrine enshrined inside a natural sea cave on a rugged Pacific cliff. Famous for "Undama" (lucky stone) tossing into the turtle rock basin.',
      daytimeHighlight:
        'Vibrant vermilion main hall nestled inside a sea cave with crashing Pacific waves and the traditional Undama lucky stone toss!',
      nighttimeHighlight:
        'At twilight, lanterns illuminate the sacred coastal grounds as golden sunset reflects on the ocean waves.',
      hours: '06:00 - 18:00 (Apr-Sep) / 07:00 - 17:00 (Oct-Mar)',
      tags: ['Cave Shrine', 'Undama Toss', 'Good Luck & Safe Birth', 'National Scenic Spot'],
    },
    zh: {
      name: '鹈户神宫（Udo Shrine）',
      categoryLabel: '名胜洞穴神社',
      area: '日南海岸地区',
      description:
        '全国极为罕见的座落于日向滩断崖海蚀洞穴之中的神社。向海中龟石的凹槽投掷“运玉”祈愿以求结缘、安产与开运而闻名。',
      daytimeHighlight:
        '太平洋狂澜拍击的悬崖海蚀洞穴内朱红色的壮丽本殿，以及趣味十足的“投运玉”开运体验！',
      nighttimeHighlight:
        '傍晚夕阳将大海染成金色，参道石灯笼亮起，展现神圣庄严的黄昏风貌。',
      hours: '06:00 - 18:00（4月〜9月）/ 07:00 - 17:00（10月〜3月）',
      tags: ['海蚀洞本殿', '投运玉祈愿', '结缘・安产', '国家指定名胜'],
    },
  },
  'spot-obi-castle': {
    en: {
      name: 'Obi Castle Town & Bamboo Lantern Walk',
      categoryLabel: 'Historical Town Walk',
      area: 'Obi Area',
      description:
        'Known as the "Little Kyoto of Kyushu," Obi preserves Edo-period stone walls, samurai residences, century-old Obi cedar trees, and carp swimming in crystal-clear water channels.',
      daytimeHighlight:
        'Stroll through ancient samurai residences and koi fish canals while sampling local Obi-ten and thick rolled omelet!',
      nighttimeHighlight:
        'Magical illumination of the historic castle gates and mossy stone walls by traditional Japanese bamboo lanterns.',
      hours: 'Facility visits: 09:30 - 17:00 / Night Lanterns: 18:00 - 21:30',
      nightHours: 'Bamboo Lantern Illumination 18:00 - 21:30 (Year-round)',
      tags: ['Little Kyoto of Kyushu', 'Samurai Residences', 'Bamboo Lantern Illumination', 'Obi-ten Gourmet'],
      reservationOptions: [
        'Town Walking & Eating Pass (with 5 vouchers)',
        'Pass + Guided Historical Tour (+¥800)',
        'Night Walking Japanese Paper Lantern Rental (+¥500)',
      ],
    },
    zh: {
      name: '饫肥城下町与竹灯笼漫步（九州小京都）',
      categoryLabel: '历史・古镇漫步',
      area: '饫肥地区',
      description:
        '拥有“九州小京都”美称的饫肥藩5万1千石古城町。保留着百年古杉、雄浑石垣与武士宅邸，清澈水渠中锦鲤畅游，入选日本重要传统建造物群保存地区。',
      daytimeHighlight:
        '漫步于江户初期的石垣、武士宅邸与锦鲤畅游的清溪旁，品尝当地特色饫肥天妇罗与厚烧玉子！',
      nighttimeHighlight:
        '入夜后，城门大手门与古朴石垣被梦幻般的和风竹灯笼点亮，尽享宁静悠闲的古城之夜。',
      hours: '设施参观 09:30 - 17:00 / 夜间竹灯笼点灯 18:00 - 21:30',
      nightHours: '竹灯笼点灯 18:00 - 21:30（全年常设）',
      tags: ['九州小京都', '武士宅邸', '竹灯笼夜景', '饫肥天美食'],
      reservationOptions: [
        '美食漫步地图＆5张特色美食兑换券',
        '美食漫步券＋历史专业向导讲解（+800日元）',
        '夜间漫步竹灯笼提灯租借（+500日元）',
      ],
    },
  },
  'spot-ocean-kayak': {
    en: {
      name: 'Nichinan Scenic Sea Kayak & Clear SUP Experience',
      categoryLabel: 'Marine Activity',
      area: 'Nichinan Coast / Futo Area',
      description:
        'Glide across emerald and sapphire tropical waters along the Nichinan Coast Quasi-National Park with experienced guides on sea kayaks or 100% transparent SUP boards.',
      daytimeHighlight:
        'Paddle through crystal-clear emerald water to explore sea caves and strange volcanic coastal rocks with tropical fish below!',
      nighttimeHighlight:
        'Sunset tour floating peacefully as the golden sun sets into the ocean horizon.',
      hours: 'Morning 09:30 / Afternoon 13:30 / Sunset 16:30 (Reservation required)',
      tags: ['Clear SUP', 'Sea Kayaking', 'Crystal Waters', 'Instructor Included'],
      reservationOptions: [
        'Daytime Clear SUP & Snorkeling Tour',
        'Sunset Dusk Sea Kayaking Tour',
        'Free Waterproof Phone Case & Photo Data Included',
      ],
    },
    zh: {
      name: '日南海岸 绝景海景皮划艇与透明SUP立桨体验',
      categoryLabel: '海上户外体验',
      area: '日南海岸・富土地区',
      description:
        '在日南海岸国定公园清澈见底的南国海域，由专业教练带领体验透明SUP立桨或双人海景皮划艇，探索奇岩怪石与海蚀洞穴。',
      daytimeHighlight:
        '穿行于透明度极高的翡翠绿海面上，近距离探索海蚀洞穴与热带鱼群的奇幻冒险！',
      nighttimeHighlight:
        '夕阳航次在金色夕阳映照海面的余晖中漂浮，享受身心彻底放松的至臻时光。',
      hours: '上午场 09:30 / 下午场 13:30 / 日落场 16:30（需提前预约）',
      tags: ['透明SUP', '海景皮划艇', '极高透明度', '含专业教练'],
      reservationOptions: [
        '白天透明SUP＆浮潜体验',
        '日落黄昏皮划艇之旅',
        '免费赠送防水手机袋与高清航拍照片',
      ],
    },
  },
  'spot-aburatsu-bar': {
    en: {
      name: 'Aburatsu Red Brick Warehouse & Yotten Night Bar',
      categoryLabel: 'Night Bar & Gourmet',
      area: 'Aburatsu Port Area',
      description:
        'Built in 1921, this registered cultural property red brick warehouse lights up at night with open-air terrace dining, craft beers brewed with Nichinan citrus, and fresh local seafood.',
      daytimeHighlight:
        'Taisho-era retro red brick heritage building and pleasant shopping arcade walk.',
      nighttimeHighlight:
        'Warm outdoor lanterns, craft beers, and fresh seafood bar on a wooden deck by the harbor breeze!',
      hours: '11:30 - 15:00 / 17:30 - 23:00 (L.O. 22:30)',
      nightHours: 'Night Bar 17:30 - 23:00',
      tags: ['Red Brick Illumination', 'Local Craft Beer', 'Harbor Terrace', 'Night Cafe'],
      reservationOptions: [
        'Terrace Table Guaranteed + Nichinan Craft Beer Tasting Flight',
        'Local Fresh Fish Carpaccio & Bar Course',
        'Non-alcoholic Miyazaki Citrus Cocktail Set',
      ],
    },
    zh: {
      name: '油津红砖馆与Yotten夜间露天小酒馆',
      categoryLabel: '夜间小酒馆・美食',
      area: '油津港地区',
      description:
        '建于大正10年（1921年）的国家登录有形文化财红砖仓库。入夜后被温暖灯火环绕，在木质露台上品味日南柑橘精酿啤酒与当地海鲜料理。',
      daytimeHighlight:
        '感受大正浪漫怀旧风情的国家级红砖历史建筑与复古油津老街漫步。',
      nighttimeHighlight:
        '点亮复古灯光的木甲板露台上，伴随海港微风畅饮精酿啤酒与日南鲜鱼料理的惬意之夜！',
      hours: '11:30 - 15:00 / 17:30 - 23:00（最后点单 22:30）',
      nightHours: '夜间酒吧营业 17:30 - 23:00',
      tags: ['红砖仓库夜景', '日南精酿啤酒', '海港露台座', '夜间咖啡馆'],
      reservationOptions: [
        '露台指定席＋日南精酿啤酒试饮品鉴套装',
        '当地鲜鱼薄片卡尔帕乔＆特色酒吧套餐',
        '无酒精宫崎柑橘特调鸡尾酒套装',
      ],
    },
  },
  'spot-nango-onsen': {
    en: {
      name: 'Nango Seaside Stargazing Hot Spring & Open-Air Bath',
      categoryLabel: 'Hot Spring & Ocean View',
      area: 'Nango Area',
      description:
        'A scenic seaside hot spring overlooking the Pacific Ocean. Rich in natural skin-smoothing minerals, offering peaceful outdoor bathing under a canopy of stars and ocean waves.',
      daytimeHighlight:
        'Panoramic Pacific ocean view and coastal islands with refreshing ocean breezes while soaking in beautifying hot waters.',
      nighttimeHighlight:
        'Listen to rhythmic waves while gazing up at a star-studded sky and moonlit waters in the outdoor bath.',
      hours: 'Day-trip bath: 10:00 - 21:30 (Last admission 21:00)',
      nightHours: 'Stargazing Open-Air Bath 18:00 - 21:30',
      tags: ['Starry Open-Air Bath', 'Beautifying Waters', 'Ocean View', 'Sauna'],
      reservationOptions: [
        'Night Bath Ticket + Bath Towel Rental Set',
        'Night Onsen + Nichinan Special Mandarin Orange Soft-serve (+¥350)',
        'Private Sea-Breeze Sauna Plan (+¥1,500)',
      ],
    },
    zh: {
      name: '南乡海滨星空天然温泉与海景露天风吕',
      categoryLabel: '夜间温泉・海景浴池',
      area: '南乡地区',
      description:
        '坐落于南乡海畔、全景眺望太平洋的天然美肌温泉。富含碳酸氢钠盐泉，沐浴后肌肤滑润细腻，夜晚更能一边听涛一边仰望漫天繁星。',
      daytimeHighlight:
        '将太平洋碧波与绿意岛屿尽收眼底，沐浴在海风拂面的天然美肌汤池中。',
      nighttimeHighlight:
        '倾听浪涛翻滚，仰望头顶繁星满天与银白月光，极尽身心治愈的海滨露天温泉。',
      hours: '日归温泉 10:00 - 21:30（最后入馆 21:00）',
      nightHours: '星空露天风吕 18:00 - 21:30',
      tags: ['星空露天风吕', '美肌天然温泉', '全海景视野', '海风桑拿'],
      reservationOptions: [
        '夜间入浴券＋专用浴巾租借套装',
        '夜温泉＋日南特制蜜柑冰淇淋（+350日元）',
        '海风私享包场桑拿方案（+1,500日元）',
      ],
    },
  },
  'spot-katsuo-aburi': {
    en: {
      name: 'Nichinan Single-Hook Bonito Charcoal Grill "Bibi"',
      categoryLabel: 'Local Specialty Gourmet',
      area: 'Aburatsu / Nichinan Coast Area',
      description:
        'Famous restaurant serving Nichinan’s top specialty: freshly caught pole-and-line bonito, lightly grilled over desktop charcoal burners, then enjoyed with soy sauce, sesame dressing, and dashi tea broth.',
      daytimeHighlight:
        'Enjoy Japan’s #1 pole-and-line bonito grilled at your table on miniature charcoal braziers in 3 delicious styles!',
      nighttimeHighlight:
        'Relax in evening ambiance savoring bonito sashimi and local charcoal-grilled Miyazaki chicken paired with authentic sweet potato shochu.',
      hours: '11:00 - 14:30 / 17:00 - 21:00 (L.O. 20:30)',
      nightHours: 'Evening service 17:00 - 21:00',
      tags: ['Single-Hook Bonito', 'Desktop Charcoal Grill', 'Nichinan Specialty', 'Tatami Seating'],
      reservationOptions: [
        'Famous Grilled Bonito Set Table Reservation',
        'Bonito Set + Miyazaki Jitokko Chicken Charcoal Grill (+¥800)',
        'Extra Fresh Sashimi Deluxe Nichinan Gozen (+¥1,000)',
      ],
    },
    zh: {
      name: '日南竿钓鲣鱼炙烤重 矶料理Bibi',
      categoryLabel: '当地招牌名物料理',
      area: '油津・日南海岸地区',
      description:
        '捕获量日本第一的日南名物“竿钓鲣鱼炙烤重”代表名店。新鲜鲣鱼在桌面小炭炉上微烤至表皮焦香，搭配秘制酱油汁、芝麻酱，最后注入热汤作茶泡饭，三度美味回味无穷。',
      daytimeHighlight:
        '品尝渔获量日本第一的日南竿钓鲣鱼！在桌面七轮炭炉上炙烤，一重三吃风味绝佳。',
      nighttimeHighlight:
        '在入夜优雅氛围中，搭配宫崎正宗甘薯烧酒，慢慢品味鲣鱼刺身与炭烤地鸡。',
      hours: '11:00 - 14:30 / 17:00 - 21:00（最后点单 20:30）',
      nightHours: '夜间营业 17:00 - 21:00',
      tags: ['一本钓鲣鱼', '七轮炭火微烤', '日南必吃名物', '榻榻米坐席'],
      reservationOptions: [
        '招牌竿钓鲣鱼炙烤重 保证坐席套餐',
        '鲣鱼炙烤重＋宫崎地头鸡炭火烧套装（+800日元）',
        '豪华生鱼片增量 特选日南御膳（+1,000日元）',
      ],
    },
  },
  'spot-stargazing-tour': {
    en: {
      name: 'Nichinan Coast Stargazing & Milky Way Night Tour',
      categoryLabel: 'Night Stargazing Tour',
      area: 'Nichinan Coast / Nango Area',
      description:
        'Lay back on oceanfront reclining chairs far from city lights to admire brilliant constellations, shooting stars, and the Milky Way with certified astronomy guides.',
      daytimeHighlight: '(Nighttime exclusive program - not available during daytime)',
      nighttimeHighlight:
        'Gaze at the brilliant Milky Way with the naked eye on a dark coastal beach guided by certified starry sky sommeliers!',
      hours: 'Night departure 19:45 - 21:15 (Reservation required)',
      nightHours: '19:45 - 21:15',
      tags: ['Milky Way', 'Astronomy Sommelier', 'Binoculars Included', 'Dark Night Sky'],
      reservationOptions: [
        'Starry Sky Guide + High-Powered Binoculars Rental',
        'Commemorative Starry Night Photo Service (+¥1,000)',
        'Hot Nichinan Blend Coffee or Tea Included',
      ],
    },
    zh: {
      name: '日南海岸 漫天星空与银河观赏夜间向导游',
      categoryLabel: '夜间星空体验',
      area: '日南海岸・南乡地区',
      description:
        '在远离城市光污染的海滨，躺在舒适躺椅上听着海浪声，由星空品鉴师带领用肉眼和高倍双筒望远镜仰望浩瀚银河与满天繁星。',
      daytimeHighlight: '（本活动为夜间专属体验，白天不开放）',
      nighttimeHighlight:
        '在无灯光干扰的海滨，仰望肉眼清晰可见的璀璨银河与星座，由专业星空向导娓娓道来！',
      hours: '夜间 19:45集合 - 21:15解散（完全预约制）',
      nightHours: '19:45 - 21:15',
      tags: ['璀璨银河', '星空向导', '含高倍双筒镜', '静谧海滨星空'],
      reservationOptions: [
        '星空向导解说＋高倍望远镜租借',
        '专业星空纪念合影拍摄服务（+1,000日元）',
        '含热日南特调咖啡或温热煎茶',
      ],
    },
  },
  'spot-michi-nango': {
    en: {
      name: 'Michi-no-Eki Nango & Tropical Jacaranda Hill',
      categoryLabel: 'Scenic Rest Stop & Produce',
      area: 'Nango Area',
      description:
        'A scenic coastal roadside station located at the southern tip of Nichinan Coast Quasi-National Park, famous for purple jacaranda blossoms, sweet ripe mango treats, and local citrus fruit.',
      daytimeHighlight:
        'Sweeping views of emerald ocean and lush tropical islands from the lookout deck with sweet Miyazaki mango soft ice cream!',
      nighttimeHighlight:
        'Sunset turns the Pacific horizon glowing crimson as ocean breezes cool the scenic hilltop.',
      hours: '08:30 - 17:00 (Restaurant 10:00 - 16:00)',
      tags: ['Ripe Mango', 'Jacaranda Blossoms', 'Coastal Drive', 'Souvenir Shopping'],
    },
    zh: {
      name: '道之驿南乡与热带蓝花楹之丘（Michi-no-Eki Nango）',
      categoryLabel: '绝景公路驿站・特产',
      area: '南乡地区',
      description:
        '位于日南海岸国定公园南端、依山傍海的绝景公路驿站。春末夏初盛开大片紫色蓝花楹，全年汇聚完熟芒果与日南特产柑橘等美味特产。',
      daytimeHighlight:
        '从山顶观景平台俯瞰碧蓝海湾与群岛，品尝甜美醇厚的完熟芒果冰淇淋与热带水果！',
      nighttimeHighlight:
        '黄昏时分远眺太平洋海面上岛屿剪影沐浴在晚霞中，感受清凉的海风吹拂。',
      hours: '08:30 - 17:00（餐厅 10:00 - 16:00）',
      tags: ['完熟芒果', '蓝花楹盛开', '日南海岸兜风', '丰富特产伴手礼'],
    },
  },
  'spot-inohae-valley': {
    en: {
      name: 'Inohae Valley Forest Therapy & Moss Trail',
      categoryLabel: 'Nature & Forest Bathing',
      area: 'Kitago Area',
      description:
        'A primeval lush valley designated as an official Forest Therapy Base by Japan’s Ministry of the Environment. Home to over 300 rare moss varieties, crystal cascades, and pure negative ions.',
      daytimeHighlight:
        'Trek through a mystical moss-carpeted ancient forest with over 300 moss varieties, sparkling waterfalls, and refreshing negative ions!',
      nighttimeHighlight: '(For safety, entry is restricted at night)',
      hours: 'Recommended walking 08:30 - 16:30 (Daylight hours)',
      tags: ['Forest Therapy', 'Moss Valley', 'Negative Ions', 'Waterfall Trail'],
    },
    zh: {
      name: '猪八重溪谷 森林疗法与苔藓回廊（Inohae Valley）',
      categoryLabel: '自然・森林浴',
      area: '北乡地区',
      description:
        '日本环境省官方认证的“森林疗法基地”原生溪谷。生长着世界罕见的300多种珍贵苔藓，清澈瀑布溪流与负氧离子环绕的自然疗愈徒步胜地。',
      daytimeHighlight:
        '漫步于300多种野生苔藓地毯与穿透林间的阳光下，在瀑布与清泉的负离子中唤醒身心活力！',
      nighttimeHighlight: '（出于安全考虑，夜间禁止入山）',
      hours: '建议徒步时间 08:30 - 16:30（日间光线充足时段）',
      tags: ['森林疗愈', '珍稀苔藓溪谷', '丰富负氧离子', '瀑布徒步'],
    },
  },
  'spot-horikawa-canal': {
    en: {
      name: 'Horikawa Canal & Carp Red Road (Aburatsu)',
      categoryLabel: 'Historic Canal & Heritage',
      area: 'Aburatsu Port Area',
      description:
        'A historical stone canal dug during the Edo period to transport Obi cedar logs, featuring the stone Otohime Bridge. Famous as a filming location and for the vibrant red Carp Road supporting the baseball team.',
      daytimeHighlight:
        'Walk along the historic Edo-period stone canal, Otohime Bridge, and the cheerful red Carp Road celebrating the Hiroshima Toyo Carp spring camp!',
      nighttimeHighlight:
        'Vintage gas-style streetlights cast romantic reflections on the canal water at twilight.',
      hours: 'Open 24 hours (Street lamps light up from dusk to 22:00)',
      tags: ['Stone Canal', 'Carp Baseball Road', 'Retro Photos', 'Gaslight Ambience'],
    },
    zh: {
      name: '堀川运河与Carp一条街（油津）',
      categoryLabel: '历史・石造运河',
      area: '油津港地区',
      description:
        '江户时代为运送饫肥杉而开凿的石造运河与堀川桥（乙姬桥）。曾是知名电影取景地，邻近的油津商业街作为广岛东洋鲤鱼队春训基地，铺设了醒目的红色“Carp一条街”。',
      daytimeHighlight:
        '漫步在江户初期的石砌运河与乙姬桥畔，打卡充满昭和情调的老街与鲜红色的鲤鱼队一条街！',
      nighttimeHighlight:
        '夕阳落入海港，复古煤气风街灯在静谧运河水面上投下温暖倒影，古意盎然。',
      hours: '全天自由漫步（街灯点亮时间：日落〜22:00）',
      tags: ['石造古运河', '鲤鱼队红道', '复古摄影胜地', '复古煤气街灯'],
    },
  },
};

// UI Translations dictionary
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  ja: {
    // Brand
    brandTitle: 'ときめぐり日南',
    brandSub: 'DAY&NIGHT',
    brandTagline: '〜時間帯で姿を変える観光＆スマートパスポート〜',
    // Nav
    navCourse: 'モデルコース',
    navBooking: '事前予約',
    navMyTickets: 'マイチケット',
    navAdmin: '受付管理',
    // Theme
    themeLabel: '表示モード:',
    themeAuto: '自動（現在時刻）',
    themeDay: '昼',
    themeSunset: '夕景',
    themeNight: '夜',
    themeDayDesc: '☀️ 昼モード（青い海と南国の太陽）',
    themeSunsetDesc: '🌅 夕方モード（サンセット＆マジックアワー）',
    themeNightDesc: '🌙 夜モード（満天星空＆ライトアップ）',
    // Home Info
    infoBadge: '日南 観光インフォメーション',
    infoUpdate: '更新',
    infoHelpBtn: '使い方・操作説明',
    sunsetLabel: '本日サンセット時刻',
    sunsetSuffix: '前後',
    stargazingLabel: '夜の星空観測指数',
    ticketSavedNotice: '予約済みのデジタルチケット（QRコード）が保存されています',
    ticketViewBtn: 'チケットを表示',
    // Course Banner
    courseBadge: '新機能・現在地＆好みから最短ルート自動作成',
    courseTitle: '日南モデルコース自動提案 〜あなただけの最適ルート〜',
    courseDesc: '現在地や滞在時間（半日・1日・夕景夜ステイ）、旅のテーマに合わせて効率的な観光プランを即座に自動生成。Googleマップ一括ナビやタイムスケジュールもすぐ確認できます！',
    courseCreateBtn: 'モデルコースを自動作成',
    // Pre-booking
    prebookingTitle: '【要事前予約】日南の人気体験・特別入場チケット',
    prebookingBadge: 'QR即時発行',
    prebookingDesc: '満席や混雑を避けてスムーズに楽しめる、事前予約対象スポットです。スマホで完結しQRコードで当日そのまま入場・利用できます。',
    bookNowBtn: '予約へ',
    adultUnit: '/ 大人',
    // Spots Section
    spotsTitle: '日南 観光スポット一覧',
    spotsSubtitle: '日中の雄大な絶景から、夕暮れのサンセット、夜の竹灯籠やライトアップまで日南の魅力を網羅',
    matchingCount: '該当:',
    itemsCount: '件',
    tabAll: '✨ すべて',
    tabDay: '☀️ 昼のスポット（Day）',
    tabSunset: '🌅 夕景・黄昏（Sunset）',
    tabNight: '🌙 夜のスポット・夜景（Night）',
    categoryLabel: 'ジャンル:',
    catAll: 'すべて',
    catSightseeing: '名勝・絶景',
    catExperience: '体験・ツアー',
    catHistoric: '歴史・文化',
    catGourmet: 'ご当地グルメ',
    catOnsen: '夜温泉',
    reservationOnly: '🎫 要事前予約のみ表示',
    searchPlaceholder: 'スポット名や地名で検索...',
    // Live Console
    consoleTitle: 'リアルタイム混雑ステータス ＆ 現在地ナビ',
    consoleDesc: '日南各スポットの現在混雑度をリアルタイム算出。現在地からの距離・車での移動時間も即座に分かります。',
    refreshBtn: '混雑状況を更新',
    refreshing: '更新中...',
    filterLabel: '混雑フィルター:',
    filterAll: 'すべて',
    filterSmooth: '🟢 空いています',
    filterModerate: '🟡 やや混雑',
    filterBusy: '🔴 混雑気味',
    locationActive: '現在地設定中:',
    locationCalculating: '（全スポットへの距離と車移動時間を表示中）',
    locationReacquire: 'GPS再取得',
    locationGetBtn: '📍 現在地を取得して距離・所要時間を計算',
    locationLocating: '現在地を取得中...',
    presetLabel: 'または出発地を選択:',
    sortLabel: '並び替え:',
    sortDefault: 'おすすめ順',
    sortNearest: '📍 近い順',
    sortNearestNeedsGps: '(要位置情報)',
    sortLeastCrowded: '🟢 混雑が少ない順',
    displayCount: '表示:',
    noSpotsFound: '該当する観光スポットが見つかりませんでした。',
    noSpotsHint: 'フィルター条件（時間帯・混雑度・ジャンル・キーワード）を変更してお試しください。',
    resetFilters: 'すべてのフィルターをリセット',
    // SpotCard
    statusSmooth: '空いています',
    statusModerate: 'やや混雑',
    statusBusy: '混雑気味',
    distFromLocation: '現在地から 約',
    distCar: '（車で約',
    distMin: '分）',
    measureDistBtn: '現在地からの距離を測る',
    requiresBooking: '要事前予約',
    freeAdmission: '自由見学',
    liveStatusLabel: 'リアルタイム状況:',
    waitEstimated: '待ち目安: 約',
    waitNone: '待ち時間なし',
    updateTime: '更新:',
    dayHighlightLabel: '☀️ 昼の見どころ（Day）',
    nightHighlightLabel: '🌙 夜の見どころ＆ライトアップ（Night）',
    nightHoursLabel: '夜間:',
    viewMap: '地図を見る',
    routeGuidance: 'ルート案内',
    bookTicket: '事前予約する',
    noBookingNeeded: '予約不要（直接来場OK）',
    // Language
    langLabel: '言語 / Language:',
    // Weather
    weatherTitle: '現地リアルタイム気象',
    weatherAdviceTitle: '観光計画アドバイス',
    weatherTemp: '気温',
    weatherApparent: '体感',
    weatherPop: '降水確率',
    weatherWind: '風速',
    weatherHumidity: '湿度',
    weatherHourly: 'このあとの推移',
    weatherRefresh: '更新',
    weatherHighLow: '最高/最低',
    weatherDetailsToggle: '詳細予報',
    // Favorites
    tabFavorites: 'お気に入り',
    addToFavorites: 'お気に入りに追加',
    removeFromFavorites: 'お気に入りから解除',
    favoritesBannerTitle: 'お気に入り（ブックマーク）スポット',
    favoritesBannerDesc: 'ハートボタンで保存した日南のおすすめスポット一覧です。',
    showAllSpotsBtn: 'すべてのスポットを見る',
    noFavoritesFound: 'お気に入り登録されたスポットがありません。',
    noFavoritesHint: '気になる観光スポットカードの「♡」ボタンを押してブックマークしましょう！',
  },
  en: {
    brandTitle: 'Tokimeguri Nichinan',
    brandSub: 'DAY&NIGHT',
    brandTagline: '— Smart Tourism Passport & Day-to-Night Scenic Guide —',
    navCourse: 'Model Courses',
    navBooking: 'Pre-Booking',
    navMyTickets: 'My Tickets',
    navAdmin: 'Staff Console',
    themeLabel: 'View Mode:',
    themeAuto: 'Auto (Current Time)',
    themeDay: 'Day',
    themeSunset: 'Sunset',
    themeNight: 'Night',
    themeDayDesc: '☀️ Daytime Mode (Blue Ocean & Tropical Sun)',
    themeSunsetDesc: '🌅 Sunset Mode (Golden Hour & Magic Twilight)',
    themeNightDesc: '🌙 Night Mode (Starry Sky & Illuminations)',
    infoBadge: 'Nichinan Tourism Info',
    infoUpdate: 'Updated',
    infoHelpBtn: 'User Guide',
    sunsetLabel: "Today's Sunset Time",
    sunsetSuffix: 'approx.',
    stargazingLabel: 'Night Stargazing Index',
    ticketSavedNotice: 'You have booked digital tickets (QR Code) saved on this device',
    ticketViewBtn: 'View Tickets',
    courseBadge: 'Smart Feature: Auto-generated itinerary from your location',
    courseTitle: 'Nichinan Model Course Generator — Your Custom Route —',
    courseDesc: 'Instantly plan an optimized travel itinerary tailored to your departure point, stay duration (half day, full day, night stay), and travel preferences. Features one-click Google Maps navigation and schedules!',
    courseCreateBtn: 'Auto-Generate Model Course',
    prebookingTitle: '【Advance Booking】Popular Experiences & Special Admission',
    prebookingBadge: 'Instant QR Pass',
    prebookingDesc: 'Guaranteed admission to skip the crowds. Complete booking on your phone and display your digital QR ticket on-site.',
    bookNowBtn: 'Book Now',
    adultUnit: '/ Adult',
    spotsTitle: 'Nichinan Sightseeing Spots',
    spotsSubtitle: 'Discover coastlines, sunset shores, samurai heritage, and illuminated bamboo lantern nights.',
    matchingCount: 'Matches:',
    itemsCount: 'spots',
    tabAll: '✨ All Spots',
    tabDay: '☀️ Day (Daytime)',
    tabSunset: '🌅 Sunset (Magic Hour)',
    tabNight: '🌙 Night (Illuminations)',
    categoryLabel: 'Category:',
    catAll: 'All',
    catSightseeing: 'Scenic Views',
    catExperience: 'Activities',
    catHistoric: 'History & Culture',
    catGourmet: 'Local Gourmet',
    catOnsen: 'Hot Springs',
    reservationOnly: '🎫 Booking Required Only',
    searchPlaceholder: 'Search spot name, area, keyword...',
    consoleTitle: 'Real-Time Congestion Status & Location Navigation',
    consoleDesc: 'Real-time crowd estimates for all Nichinan spots with driving distance & travel time from your location.',
    refreshBtn: 'Refresh Status',
    refreshing: 'Updating...',
    filterLabel: 'Congestion Filter:',
    filterAll: 'All',
    filterSmooth: '🟢 Not Crowded',
    filterModerate: '🟡 Moderate',
    filterBusy: '🔴 Busy',
    locationActive: 'Current Location:',
    locationCalculating: '(Calculating distance and driving time for all spots)',
    locationReacquire: 'Re-detect GPS',
    locationGetBtn: '📍 Get Current Location for Distance & Drive Time',
    locationLocating: 'Acquiring GPS location...',
    presetLabel: 'Or choose departure point:',
    sortLabel: 'Sort by:',
    sortDefault: 'Recommended',
    sortNearest: '📍 Closest',
    sortNearestNeedsGps: '(Location needed)',
    sortLeastCrowded: '🟢 Least Crowded',
    displayCount: 'Showing:',
    noSpotsFound: 'No tourist spots match your current filter criteria.',
    noSpotsHint: 'Try adjusting the time, crowd level, category, or search keywords.',
    resetFilters: 'Reset All Filters',
    statusSmooth: 'Not Crowded',
    statusModerate: 'Moderate',
    statusBusy: 'Busy',
    distFromLocation: 'From location: approx. ',
    distCar: ' (approx. ',
    distMin: ' min drive)',
    measureDistBtn: 'Measure distance from location',
    requiresBooking: 'Booking Required',
    freeAdmission: 'Free Walk-in',
    liveStatusLabel: 'Live Status:',
    waitEstimated: 'Est. wait: approx. ',
    waitNone: 'No wait time',
    updateTime: 'Updated:',
    dayHighlightLabel: '☀️ Daytime Highlights (Day)',
    nightHighlightLabel: '🌙 Evening Highlights & Illuminations (Night)',
    nightHoursLabel: 'Night hours:',
    viewMap: 'View Map',
    routeGuidance: 'Get Directions',
    bookTicket: 'Book in Advance',
    noBookingNeeded: 'No booking needed (Direct visit OK)',
    langLabel: 'Language:',
    weatherTitle: 'Local Spot Weather',
    weatherAdviceTitle: 'Tour Planning Advice',
    weatherTemp: 'Temp',
    weatherApparent: 'Feels like',
    weatherPop: 'Rain Chance',
    weatherWind: 'Wind',
    weatherHumidity: 'Humidity',
    weatherHourly: 'Upcoming Hours',
    weatherRefresh: 'Refresh',
    weatherHighLow: 'High/Low',
    weatherDetailsToggle: 'Forecast Details',
    tabFavorites: 'Favorites',
    addToFavorites: 'Add to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    favoritesBannerTitle: 'Bookmarked Favorite Spots',
    favoritesBannerDesc: 'Your saved must-visit sightseeing spots in Nichinan.',
    showAllSpotsBtn: 'Browse All Spots',
    noFavoritesFound: 'No bookmarked spots yet.',
    noFavoritesHint: 'Tap the heart button on any spot card to add it to your favorites!',
  },
  zh: {
    brandTitle: '时光巡游日南',
    brandSub: 'DAY&NIGHT',
    brandTagline: '— 随时间流转展现不同风貌的观光＆智慧通行证 —',
    navCourse: '经典路线',
    navBooking: '提前预约',
    navMyTickets: '我的电子门票',
    navAdmin: '设施受付后台',
    themeLabel: '浏览模式:',
    themeAuto: '自动（当前时间）',
    themeDay: '白天',
    themeSunset: '夕阳黄昏',
    themeNight: '夜晚',
    themeDayDesc: '☀️ 白天模式（蔚蓝太平洋与南国阳光）',
    themeSunsetDesc: '🌅 黄昏模式（金色日落与魔幻时刻）',
    themeNightDesc: '🌙 夜晚模式（漫天星空与浪漫夜景灯光）',
    infoBadge: '日南 观光最新资讯',
    infoUpdate: '更新',
    infoHelpBtn: '使用指南・操作说明',
    sunsetLabel: '今日日落时间',
    sunsetSuffix: '前后',
    stargazingLabel: '夜间观星指数',
    ticketSavedNotice: '此设备已保存已预约的电子门票（QR码）',
    ticketViewBtn: '查看门票',
    courseBadge: '新功能：根据当前位置与喜好自动规划最优旅游路线',
    courseTitle: '日南经典旅游路线智能推荐 — 属于您的专属行程 —',
    courseDesc: '结合您的出发位置、游览时间（半日游、全天游、夜间留宿）以及旅行偏好，秒速生成高效观光方案。支持Google地图一键导航与详细时间表！',
    courseCreateBtn: '自动生成推荐路线',
    prebookingTitle: '【需提前预约】日南人气体验・特色入场门票',
    prebookingBadge: '即时出QR码',
    prebookingDesc: '避开客流高峰，提前在手机上完成预订，游览当天直接出示数字QR码入场体验。',
    bookNowBtn: '前往预约',
    adultUnit: '/ 成人',
    spotsTitle: '日南 观光景点总览',
    spotsSubtitle: '涵盖白昼雄奇海景、黄昏晚霞落日、夜间竹灯笼古城与星空温泉的日南全方位魅力',
    matchingCount: '符合条件:',
    itemsCount: '处',
    tabAll: '✨ 全部景点',
    tabDay: '☀️ 白天景点（Day）',
    tabSunset: '🌅 夕景・黄昏（Sunset）',
    tabNight: '🌙 夜晚・夜景（Night）',
    categoryLabel: '类型分类:',
    catAll: '全部',
    catSightseeing: '名胜・绝景',
    catExperience: '体验・户外',
    catHistoric: '历史・文化',
    catGourmet: '当地特色美食',
    catOnsen: '夜景温泉',
    reservationOnly: '🎫 仅显示需提前预约项目',
    searchPlaceholder: '输入景点名称、地区或关键字搜索...',
    consoleTitle: '实时客流拥挤度 ＆ 当前位置智能导航',
    consoleDesc: '实时测算日南各景点当前拥挤程度，同步显示自当前位置出发的实际距离与驾车所需时间。',
    refreshBtn: '刷新拥挤状态',
    refreshing: '更新中...',
    filterLabel: '客流状态筛选:',
    filterAll: '全部',
    filterSmooth: '🟢 空闲畅通',
    filterModerate: '🟡 稍有客流',
    filterBusy: '🔴 较为拥挤',
    locationActive: '已设置当前位置:',
    locationCalculating: '（正在实时计算至全部景点的距离与车程）',
    locationReacquire: '重新获取GPS',
    locationGetBtn: '📍 获取当前位置以计算距离与车程',
    locationLocating: '正在获取定位中...',
    presetLabel: '或快捷选择出发地:',
    sortLabel: '排序方式:',
    sortDefault: '推荐顺序',
    sortNearest: '📍 离我最近',
    sortNearestNeedsGps: '(需定位信息)',
    sortLeastCrowded: '🟢 人少优先',
    displayCount: '显示:',
    noSpotsFound: '没有找到符合当前筛选条件的观光景点。',
    noSpotsHint: '请尝试更换时间段、客流状态、分类或搜索关键词。',
    resetFilters: '重置所有筛选条件',
    statusSmooth: '空闲畅通',
    statusModerate: '稍有客流',
    statusBusy: '较为拥挤',
    distFromLocation: '距当前位置约 ',
    distCar: '（驾车约 ',
    distMin: ' 分钟）',
    measureDistBtn: '测算距当前位置的距离',
    requiresBooking: '需提前预约',
    freeAdmission: '自由参观',
    liveStatusLabel: '实时状况:',
    waitEstimated: '预计排队: 约',
    waitNone: '无需排队等待',
    updateTime: '更新时间:',
    dayHighlightLabel: '☀️ 白天亮点（Day）',
    nightHighlightLabel: '🌙 夜间看点与灯光秀（Night）',
    nightHoursLabel: '夜间时段:',
    viewMap: '查看地图',
    routeGuidance: '路线导航',
    bookTicket: '立即提前预约',
    noBookingNeeded: '无需预约（直接前往即可）',
    langLabel: '语言 / Language:',
    weatherTitle: '景点实时天气',
    weatherAdviceTitle: '出行规划建议',
    weatherTemp: '气温',
    weatherApparent: '体感',
    weatherPop: '降水概率',
    weatherWind: '风速',
    weatherHumidity: '湿度',
    weatherHourly: '后续时段天气',
    weatherRefresh: '刷新',
    weatherHighLow: '最高/最低',
    weatherDetailsToggle: '详细预报',
    tabFavorites: '我的收藏',
    addToFavorites: '加入收藏',
    removeFromFavorites: '取消收藏',
    favoritesBannerTitle: '已收藏的观光景点',
    favoritesBannerDesc: '您通过爱心按钮保存的日南心仪景点合集。',
    showAllSpotsBtn: '浏览全部景点',
    noFavoritesFound: '暂无收藏的观光景点。',
    noFavoritesHint: '点击景点卡片上的爱心按钮（♡）即可将其加入收藏夹！',
  },
};

// Helper function to return a translated spot
export function getLocalizedSpot(spot: any, lang: Language | string = 'ja') {
  if (!spot || (lang !== 'en' && lang !== 'zh')) {
    return spot;
  }

  const trans = SPOT_TRANSLATIONS[spot.id]?.[lang as 'en' | 'zh'];
  if (!trans) {
    return spot;
  }

  return {
    ...spot,
    name: trans.name || spot.name,
    categoryLabel: trans.categoryLabel || spot.categoryLabel,
    area: trans.area || spot.area,
    description: trans.description || spot.description,
    daytimeHighlight: trans.daytimeHighlight || spot.daytimeHighlight,
    nighttimeHighlight: trans.nighttimeHighlight || spot.nighttimeHighlight,
    hours: trans.hours || spot.hours,
    nightHours: trans.nightHours || spot.nightHours,
    tags: trans.tags || spot.tags,
    reservationOptions: trans.reservationOptions || spot.reservationOptions,
  };
}
