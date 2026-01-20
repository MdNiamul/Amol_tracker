import { useState } from 'react';
import { BookOpen, Moon, Sparkles, Heart, ChevronDown, ChevronUp, ExternalLink, Clock, BookMarked, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResourceSection {
  id: string;
  title: string;
  bengali: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const FiveWaqtNamaz = () => (
  <div className="space-y-4 text-sm">
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-bold text-lg mb-3 text-primary">১. ফজরের নামাজ (২ রাকাত সুন্নত + ২ রাকাত ফরজ)</h4>
      <div className="space-y-2">
        <p><strong>সময়:</strong> সুবহে সাদিক থেকে সূর্যোদয়ের আগ পর্যন্ত</p>
        <p><strong>নিয়ত:</strong> "নাওয়াইতু আন উসাল্লিয়া লিল্লাহি তা'আলা রাকাতাই সালাতিল ফাজরি ফারদুল্লাহি তা'আলা মুতাওয়াজ্জিহান ইলা জিহাতিল কা'বাতিশ শারীফাতি আল্লাহু আকবার"</p>
        <p className="text-muted-foreground"><strong>বাংলা নিয়ত:</strong> আমি কিবলামুখী হয়ে আল্লাহর উদ্দেশ্যে ফজরের দুই রাকাত ফরজ নামাজ আদায় করছি। আল্লাহু আকবার।</p>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-bold text-lg mb-3 text-primary">২. যোহরের নামাজ (৪+৪+২+২ = ১২ রাকাত)</h4>
      <div className="space-y-2">
        <p><strong>সময়:</strong> সূর্য পশ্চিমে ঢলে পড়ার পর থেকে আসরের আগ পর্যন্ত</p>
        <p><strong>ক্রম:</strong> ৪ রাকাত সুন্নত → ৪ রাকাত ফরজ → ২ রাকাত সুন্নত → ২ রাকাত নফল</p>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-bold text-lg mb-3 text-primary">৩. আসরের নামাজ (৪+৪ = ৮ রাকাত)</h4>
      <div className="space-y-2">
        <p><strong>সময়:</strong> যোহরের সময় শেষ হওয়ার পর থেকে সূর্যাস্তের আগ পর্যন্ত</p>
        <p><strong>ক্রম:</strong> ৪ রাকাত সুন্নত (ঘায়রে মুয়াক্কাদা) → ৪ রাকাত ফরজ</p>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-bold text-lg mb-3 text-primary">৪. মাগরিবের নামাজ (৩+২+২ = ৭ রাকাত)</h4>
      <div className="space-y-2">
        <p><strong>সময়:</strong> সূর্যাস্তের পর থেকে পশ্চিম আকাশের লালিমা দূর হওয়া পর্যন্ত</p>
        <p><strong>ক্রম:</strong> ৩ রাকাত ফরজ → ২ রাকাত সুন্নত → ২ রাকাত নফল</p>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-bold text-lg mb-3 text-primary">৫. ইশার নামাজ (৪+৪+২+২+৩ = ১৫ রাকাত)</h4>
      <div className="space-y-2">
        <p><strong>সময়:</strong> মাগরিবের সময় শেষ হওয়ার পর থেকে সুবহে সাদিকের আগ পর্যন্ত</p>
        <p><strong>ক্রম:</strong> ৪ রাকাত সুন্নত → ৪ রাকাত ফরজ → ২ রাকাত সুন্নত → ২ রাকাত নফল → ৩ রাকাত বিতর</p>
      </div>
    </div>
    
    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
      <h4 className="font-bold mb-2">নামাজের রুকন (ফরজ):</h4>
      <ul className="space-y-1 list-disc list-inside text-muted-foreground">
        <li>তাকবীরে তাহরীমা (আল্লাহু আকবার বলে হাত বাঁধা)</li>
        <li>কিয়াম (দাঁড়িয়ে থাকা)</li>
        <li>কিরাআত (সূরা ফাতিহা ও অন্য সূরা পড়া)</li>
        <li>রুকু (ঝুঁকে দাঁড়ানো)</li>
        <li>সিজদা (মাটিতে কপাল রাখা)</li>
        <li>কাদা আখিরা (শেষ বৈঠক)</li>
      </ul>
    </div>
  </div>
);

const HadithSection = () => (
  <div className="space-y-4">
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-primary">
      <p className="font-arabic text-xl mb-2 text-right">مَنْ صَلَّى الْفَجْرَ فِي جَمَاعَةٍ ثُمَّ قَعَدَ يَذْكُرُ اللَّهَ حَتَّى تَطْلُعَ الشَّمْسُ ثُمَّ صَلَّى رَكْعَتَيْنِ كَانَتْ لَهُ كَأَجْرِ حَجَّةٍ وَعُمْرَةٍ</p>
      <p className="text-sm text-muted-foreground mb-2">যে ব্যক্তি জামাতে ফজরের নামাজ পড়ে সূর্যোদয় পর্যন্ত আল্লাহর জিকির করে, তারপর দুই রাকাত (ইশরাক) নামাজ পড়ে, তার জন্য একটি হজ ও উমরার সমান সওয়াব।</p>
      <p className="text-xs text-muted-foreground">— তিরমিযী</p>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-green-500">
      <p className="font-arabic text-xl mb-2 text-right">الصَّلَاةُ عَلَى وَقْتِهَا</p>
      <p className="text-sm text-muted-foreground mb-2">রাসূলুল্লাহ (সাঃ) কে জিজ্ঞেস করা হলো, কোন আমল আল্লাহর কাছে সবচেয়ে প্রিয়? তিনি বললেন: "সময়মতো নামাজ আদায় করা।"</p>
      <p className="text-xs text-muted-foreground">— বুখারী ও মুসলিম</p>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-yellow-500">
      <p className="font-arabic text-xl mb-2 text-right">مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ</p>
      <p className="text-sm text-muted-foreground mb-2">যে ব্যক্তি কুরআনের একটি হরফ পড়বে, তার জন্য একটি নেকি। আর প্রতিটি নেকি দশগুণ।</p>
      <p className="text-xs text-muted-foreground">— তিরমিযী</p>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-purple-500">
      <p className="font-arabic text-xl mb-2 text-right">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
      <p className="text-sm text-muted-foreground mb-2">তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি যে কুরআন শেখে এবং অন্যকে শেখায়।</p>
      <p className="text-xs text-muted-foreground">— বুখারী</p>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-blue-500">
      <p className="font-arabic text-xl mb-2 text-right">الدُّعَاءُ هُوَ الْعِبَادَةُ</p>
      <p className="text-sm text-muted-foreground mb-2">দোয়াই হলো ইবাদত।</p>
      <p className="text-xs text-muted-foreground">— তিরমিযী</p>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg border-l-4 border-orange-500">
      <p className="font-arabic text-xl mb-2 text-right">مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ</p>
      <p className="text-sm text-muted-foreground mb-2">সদকা সম্পদ কমায় না। বরং আল্লাহ সম্পদে বরকত দেন।</p>
      <p className="text-xs text-muted-foreground">— মুসলিম</p>
    </div>
  </div>
);

const TahajjudRules = () => (
  <div className="space-y-4 text-sm">
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-semibold text-foreground mb-2">তাহাজ্জুদ নামাজের নিয়ম</h4>
      <ul className="space-y-2 text-muted-foreground">
        <li>• <strong>সময়:</strong> রাত ১২টার পর থেকে ফজরের আগে পর্যন্ত</li>
        <li>• <strong>সর্বোত্তম সময়:</strong> রাতের শেষ তৃতীয়াংশ</li>
        <li>• <strong>রাকাত:</strong> কমপক্ষে ২ রাকাত, সর্বোচ্চ ১২ রাকাত</li>
        <li>• <strong>নিয়ম:</strong> দুই দুই রাকাত করে পড়তে হয়</li>
      </ul>
    </div>
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-semibold text-foreground mb-2">তাহাজ্জুদের নিয়ত</h4>
      <p className="font-arabic text-lg text-primary mb-2 leading-relaxed">
        نَوَيْتُ اَنْ اُصَلِّىَ رَكْعَتَىْ صَلوةِ التَّهَجُّدِ سُنَّةُ رَسُوْلِ اللهِ تَعَالى مُتَوَجِّهًا اِلى جِهَةِ الْكَعْبَةِ الشَّرِيْفَةِ اَللهُ اَكْبَرْ
      </p>
      <p className="text-muted-foreground text-xs">
        "আমি কিবলামুখী হয়ে আল্লাহর সন্তুষ্টির জন্য দুই রাকাত তাহাজ্জুদ নামাজের নিয়ত করছি। আল্লাহু আকবার।"
      </p>
    </div>
    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
      <h4 className="font-semibold text-foreground mb-2">তাহাজ্জুদের ফজিলত</h4>
      <p className="text-muted-foreground text-xs italic">
        "রাতের নামাজ ফরজ নামাজের পর সবচেয়ে উত্তম।" - সহীহ মুসলিম
      </p>
    </div>
  </div>
);

const DailyDhikr = () => (
  <div className="space-y-3">
    {[
      { arabic: 'سُبْحَانَ اللهِ', bengali: 'সুবহানাল্লাহ', meaning: 'আল্লাহ পবিত্র', count: '৩৩ বার' },
      { arabic: 'اَلْحَمْدُ لِلّهِ', bengali: 'আলহামদুলিল্লাহ', meaning: 'সমস্ত প্রশংসা আল্লাহর', count: '৩৩ বার' },
      { arabic: 'اَللهُ اَكْبَرْ', bengali: 'আল্লাহু আকবার', meaning: 'আল্লাহ সবচেয়ে মহান', count: '৩৪ বার' },
      { arabic: 'لَا إِلَٰهَ إِلَّا اللهُ', bengali: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'আল্লাহ ছাড়া কোনো ইলাহ নেই', count: '১০০ বার' },
      { arabic: 'اَسْتَغْفِرُ اللهَ', bengali: 'আস্তাগফিরুল্লাহ', meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই', count: '১০০ বার' },
      { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ', bengali: 'লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ', meaning: 'আল্লাহর সাহায্য ছাড়া কোনো উপায় নেই', count: 'বেশি বেশি' },
    ].map((dhikr, idx) => (
      <div key={idx} className="p-3 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition-colors">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-arabic text-xl text-primary mb-1">{dhikr.arabic}</p>
            <p className="font-medium text-foreground text-sm">{dhikr.bengali}</p>
            <p className="text-xs text-muted-foreground">{dhikr.meaning}</p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {dhikr.count}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const DailyDua = () => (
  <div className="space-y-4">
    {[
      {
        title: 'ঘুম থেকে উঠার দোয়া',
        arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِىْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَ اِلَيْهِ النُّشُوْرُ',
        bengali: 'আলহামদু লিল্লা-হিল্লাযী আহইয়া-না- বা\'দা মা- আমা-তানা- ওয়া ইলাইহিন নুশূর',
        meaning: 'সমস্ত প্রশংসা আল্লাহর যিনি আমাদের মৃত্যুর পর জীবিত করলেন এবং তাঁরই কাছে ফিরে যেতে হবে।'
      },
      {
        title: 'ঘর থেকে বের হওয়ার দোয়া',
        arabic: 'بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ لَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللهِ',
        bengali: 'বিসমিল্লাহি তাওয়াক্কালতু আ\'লাল্লাহ, লা হাওলা ওয়ালা কুওয়াতা ইল্লা বিল্লাহ',
        meaning: 'আল্লাহর নামে, আল্লাহর উপর ভরসা করছি। আল্লাহর সাহায্য ছাড়া কোনো উপায় নেই।'
      },
      {
        title: 'খাবার শুরুর দোয়া',
        arabic: 'بِسْمِ اللهِ وَبَرَكَةِ اللهِ',
        bengali: 'বিসমিল্লাহি ওয়া বারাকাতিল্লাহ',
        meaning: 'আল্লাহর নামে এবং আল্লাহর বরকতে।'
      },
      {
        title: 'ঘুমানোর দোয়া',
        arabic: 'اَللّٰهُمَّ بِاسْمِكَ اَمُوْتُ وَاَحْيَا',
        bengali: 'আল্লাহুম্মা বিসমিকা আমূতু ওয়া আহইয়া',
        meaning: 'হে আল্লাহ, তোমার নামেই আমি মরি এবং জীবিত হই।'
      },
      {
        title: 'কষ্ট ও বিপদের দোয়া',
        arabic: 'اِنَّا لِلّٰهِ وَاِنَّا اِلَيْهِ رَاجِعُوْنَ',
        bengali: 'ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন',
        meaning: 'নিশ্চয়ই আমরা আল্লাহর জন্য এবং তাঁর কাছেই ফিরে যাব।'
      },
    ].map((dua, idx) => (
      <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border/50">
        <h4 className="font-semibold text-foreground mb-2 text-sm">{dua.title}</h4>
        <p className="font-arabic text-lg text-primary mb-2 leading-relaxed text-right">{dua.arabic}</p>
        <p className="text-sm text-foreground mb-1">{dua.bengali}</p>
        <p className="text-xs text-muted-foreground italic">{dua.meaning}</p>
      </div>
    ))}
  </div>
);

const QuranSection = () => (
  <div className="space-y-4">
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-semibold text-foreground mb-2">পবিত্র কুরআন পড়ুন</h4>
      <p className="text-sm text-muted-foreground mb-4">
        প্রতিদিন কুরআন তিলাওয়াত করুন। নিচের লিংক থেকে অনলাইনে পড়তে পারবেন বা PDF ডাউনলোড করতে পারবেন।
      </p>
      <div className="flex flex-wrap gap-2">
        <a
          href="https://quran.com/bn"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" />
          Quran.com (বাংলা)
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://ia600301.us.archive.org/20/items/QuranBanglaTranslation/Quran-Bangla.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-sm"
        >
          <BookOpen className="w-4 h-4" />
          PDF ডাউনলোড
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-semibold text-foreground mb-3">আয়াতুল কুরসী (প্রতিদিন পড়ুন)</h4>
      <p className="font-arabic text-lg text-primary leading-loose text-right mb-3">
        اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ
      </p>
      <p className="text-xs text-muted-foreground italic">
        সূরা বাকারা, আয়াত ২৫৫ - ঘুমানোর আগে পড়লে সারারাত হেফাজতে থাকবেন।
      </p>
    </div>

    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
      <h4 className="font-semibold text-foreground mb-2">সূরা ইখলাস (৩ বার পড়লে পূর্ণ কুরআনের সমান)</h4>
      <p className="font-arabic text-xl text-primary leading-loose text-right mb-2">
        قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ
      </p>
    </div>
  </div>
);

// Prophet's Biography Section
const ProphetBiography = () => (
  <div className="space-y-4">
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-bold text-lg mb-3 text-primary">নবীজির (সাঃ) সংক্ষিপ্ত জীবনী</h4>
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="p-3 bg-secondary/50 rounded-lg">
          <h5 className="font-semibold text-foreground mb-2">জন্ম ও শৈশব</h5>
          <p>মুহাম্মদ (সাঃ) ৫৭০ খ্রিস্টাব্দে মক্কায় জন্মগ্রহণ করেন। তাঁর পিতা আব্দুল্লাহ তাঁর জন্মের আগেই মৃত্যুবরণ করেন এবং মাতা আমেনা ৬ বছর বয়সে মারা যান। এরপর দাদা আব্দুল মুত্তালিব এবং চাচা আবু তালিব তাঁকে লালন-পালন করেন।</p>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg">
          <h5 className="font-semibold text-foreground mb-2">নবুওয়াত প্রাপ্তি</h5>
          <p>৪০ বছর বয়সে হেরা গুহায় ধ্যানমগ্ন অবস্থায় জিবরাঈল (আঃ) এর মাধ্যমে প্রথম ওহী নাযিল হয়। সূরা আলাকের প্রথম পাঁচ আয়াত দিয়ে নবুওয়াতের সূচনা হয়।</p>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg">
          <h5 className="font-semibold text-foreground mb-2">মক্কী জীবন (১৩ বছর)</h5>
          <p>মক্কায় ১৩ বছর দাওয়াত দেন। কুরাইশদের চরম বিরোধিতা, নির্যাতন সত্ত্বেও ধৈর্য ধারণ করেন। তায়েফ সফর, মিরাজ এবং আকাবার বাইয়াত এ সময়ের উল্লেখযোগ্য ঘটনা।</p>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg">
          <h5 className="font-semibold text-foreground mb-2">হিজরত ও মাদানী জীবন</h5>
          <p>৬২২ খ্রিস্টাব্দে মদিনায় হিজরত করেন। মদিনায় ইসলামী রাষ্ট্র প্রতিষ্ঠা করেন। বদর, উহুদ, খন্দকসহ বেশ কয়েকটি যুদ্ধে অংশগ্রহণ করেন। হুদাইবিয়ার সন্ধি ও মক্কা বিজয় সম্পন্ন করেন।</p>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg">
          <h5 className="font-semibold text-foreground mb-2">বিদায় হজ ও ওফাত</h5>
          <p>১০ হিজরিতে বিদায় হজ সম্পন্ন করেন এবং আরাফাতের ময়দানে ঐতিহাসিক ভাষণ দেন। ১১ হিজরির ১২ই রবিউল আওয়াল (৬৩২ খ্রিস্টাব্দ) ৬৩ বছর বয়সে মদিনায় ইন্তেকাল করেন।</p>
        </div>
      </div>
    </div>
    
    <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
      <h4 className="font-semibold text-foreground mb-2">নবীজির (সাঃ) কিছু বৈশিষ্ট্য</h4>
      <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
        <li>সত্যবাদিতা - আল-আমীন ও আস-সাদিক উপাধি</li>
        <li>দয়া ও করুণা - রাহমাতুল্লিল আলামীন</li>
        <li>ধৈর্য ও ক্ষমা - শত্রুদেরও ক্ষমা করেছেন</li>
        <li>সাধারণ জীবনযাপন - বিলাসিতা বর্জন</li>
        <li>ন্যায়বিচার - সকলের প্রতি সমান আচরণ</li>
      </ul>
    </div>
  </div>
);

// Sahaba Biography Section
const SahabaBiography = () => (
  <div className="space-y-4">
    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h4 className="font-bold text-lg mb-3 text-primary">খুলাফায়ে রাশেদীন</h4>
      
      <div className="space-y-4">
        <div className="p-3 bg-secondary/50 rounded-lg border-l-4 border-primary">
          <h5 className="font-semibold text-foreground mb-2">১. হযরত আবু বকর সিদ্দীক (রাঃ)</h5>
          <p className="text-sm text-muted-foreground mb-2">প্রথম খলিফা (৬৩২-৬৩৪ খ্রি.)</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>রাসূল (সাঃ) এর সবচেয়ে ঘনিষ্ঠ সাহাবী ও শ্বশুর</li>
            <li>সর্বপ্রথম ইসলাম গ্রহণকারী পুরুষ</li>
            <li>হিজরতে রাসূল (সাঃ) এর সফরসঙ্গী</li>
            <li>রিদ্দার যুদ্ধে বিদ্রোহীদের দমন করেন</li>
            <li>কুরআন সংকলনের উদ্যোগ নেন</li>
          </ul>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg border-l-4 border-green-500">
          <h5 className="font-semibold text-foreground mb-2">২. হযরত উমর ইবনুল খাত্তাব (রাঃ)</h5>
          <p className="text-sm text-muted-foreground mb-2">দ্বিতীয় খলিফা (৬৩৪-৬৪৪ খ্রি.)</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>আমীরুল মুমিনীন উপাধি</li>
            <li>পারস্য ও রোমান সাম্রাজ্য জয়</li>
            <li>বায়তুল মাকদিস বিজয়</li>
            <li>হিজরি সন চালু</li>
            <li>ন্যায়বিচারের জন্য বিখ্যাত</li>
          </ul>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg border-l-4 border-yellow-500">
          <h5 className="font-semibold text-foreground mb-2">৩. হযরত উসমান ইবনে আফফান (রাঃ)</h5>
          <p className="text-sm text-muted-foreground mb-2">তৃতীয় খলিফা (৬৪৪-৬৫৬ খ্রি.)</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>যুন-নূরাইন (দুই জ্যোতির অধিকারী) - রাসূল (সাঃ) এর দুই কন্যার স্বামী</li>
            <li>কুরআনের চূড়ান্ত সংকলন</li>
            <li>মসজিদে নববী সম্প্রসারণ</li>
            <li>অত্যন্ত দানশীল ছিলেন</li>
          </ul>
        </div>
        
        <div className="p-3 bg-secondary/50 rounded-lg border-l-4 border-blue-500">
          <h5 className="font-semibold text-foreground mb-2">৪. হযরত আলী ইবনে আবি তালিব (রাঃ)</h5>
          <p className="text-sm text-muted-foreground mb-2">চতুর্থ খলিফা (৬৫৬-৬৬১ খ্রি.)</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>রাসূল (সাঃ) এর চাচাতো ভাই ও জামাতা</li>
            <li>প্রথম কিশোর মুসলিম</li>
            <li>জ্ঞান ও বীরত্বের প্রতীক</li>
            <li>"আনা মাদীনাতুল ইলম ওয়া আলীয়্যুন বাবুহা" - আমি জ্ঞানের শহর, আলী তার দরজা</li>
          </ul>
        </div>
      </div>
    </div>
    
    <div className="p-4 bg-secondary/50 rounded-lg">
      <h4 className="font-semibold text-foreground mb-3">অন্যান্য বিশিষ্ট সাহাবী</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত খাদিজা (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">রাসূল (সাঃ) এর প্রথম স্ত্রী, প্রথম মুসলিম নারী</p>
        </div>
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত বিলাল (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">ইসলামের প্রথম মুয়াজ্জিন</p>
        </div>
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত আবু হুরায়রা (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">সর্বাধিক হাদীস বর্ণনাকারী</p>
        </div>
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত আয়েশা (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">উম্মুল মুমিনীন, মহিলা ফকীহ</p>
        </div>
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত হামজা (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">সাইয়িদুশ শুহাদা (শহীদদের সর্দার)</p>
        </div>
        <div className="p-3 bg-background/50 rounded-lg">
          <h5 className="font-medium text-foreground text-sm">হযরত খালিদ বিন ওয়ালিদ (রাঃ)</h5>
          <p className="text-xs text-muted-foreground">সাইফুল্লাহ (আল্লাহর তলোয়ার)</p>
        </div>
      </div>
    </div>
  </div>
);

export const IslamicResources = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('five-waqt');

  const sections: ResourceSection[] = [
    { id: 'five-waqt', title: 'Five Daily Prayers', bengali: '৫ ওয়াক্ত নামাজ পড়ার নিয়ম', icon: Clock, content: <FiveWaqtNamaz /> },
    { id: 'prophet', title: "Prophet's Life", bengali: 'নবীজির (সাঃ) জীবনী', icon: Star, content: <ProphetBiography /> },
    { id: 'sahaba', title: "Sahaba's Life", bengali: 'সাহাবীদের জীবনী', icon: Users, content: <SahabaBiography /> },
    { id: 'hadith', title: 'Hadith', bengali: 'হাদীস শরীফ', icon: BookMarked, content: <HadithSection /> },
    { id: 'quran', title: 'Quran', bengali: 'কুরআন শরীফ', icon: BookOpen, content: <QuranSection /> },
    { id: 'tahajjud', title: 'Tahajjud', bengali: 'তাহাজ্জুদের নিয়ম', icon: Moon, content: <TahajjudRules /> },
    { id: 'dhikr', title: 'Daily Dhikr', bengali: 'দৈনিক জিকির', icon: Sparkles, content: <DailyDhikr /> },
    { id: 'dua', title: 'Daily Dua', bengali: 'দৈনিক দোয়া', icon: Heart, content: <DailyDua /> },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Islamic Resources</h2>
        <p className="text-sm text-muted-foreground">ইসলামিক রিসোর্স - প্রতিদিন পড়ুন</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="border border-border/50 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-colors",
                  isExpanded ? "bg-primary/5" : "hover:bg-secondary/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isExpanded ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-foreground block">{section.title}</span>
                    <span className="text-xs text-muted-foreground">{section.bengali}</span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {isExpanded && (
                <div className="p-4 pt-2 border-t border-border/50 animate-fade-in">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
