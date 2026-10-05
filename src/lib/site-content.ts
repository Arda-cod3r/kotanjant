/** Kurumsal / yasal bilgi sayfalarının içeriği (tek yerden yönetilir). */
export interface SitePageSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface SitePageContent {
  title: string;
  description: string;
  intro?: string;
  sections: SitePageSection[];
}

export const sitePages: Record<string, SitePageContent> = {
  hakkimizda: {
    title: "Hakkımızda",
    description: "Kotanjant Jant & Aksesuar hakkında kurumsal bilgiler.",
    intro:
      "Kotanjant, jant kapağı ve oto aksesuar alanında kaliteli ürünleri uygun fiyatlarla sunan bir kurumsal e-ticaret platformudur.",
    sections: [
      {
        heading: "Biz Kimiz?",
        paragraphs: [
          "Yıllardır oto aksesuar sektöründe edindiğimiz deneyimi, modern bir e-ticaret altyapısıyla birleştirdik. Amacımız, aracınıza değer katan ürünleri güvenilir ve hızlı bir şekilde kapınıza ulaştırmaktır.",
        ],
      },
      {
        heading: "Neden Kotanjant?",
        bullets: [
          "Geniş ölçü ve model yelpazesi (13\" – 18\" jant kapakları)",
          "Orijinal kalite standartlarına uygun ürünler",
          "Şeffaf fiyatlandırma ve gerçek stok bilgisi",
          "Uzman destek ekibi ve kolay iade imkânı",
        ],
      },
      {
        heading: "Vizyonumuz",
        paragraphs: [
          "Türkiye'nin jant kapağı ve oto aksesuar alanında en çok tercih edilen, güvenilir dijital satış platformu olmak.",
        ],
      },
    ],
  },

  iletisim: {
    title: "İletişim",
    description: "Kotanjant müşteri hizmetleri iletişim bilgileri.",
    intro: "Sorularınız, sipariş takibi ve destek talepleriniz için bize ulaşabilirsiniz.",
    sections: [
      {
        heading: "Müşteri Hizmetleri",
        bullets: [
          "Telefon: 0850 000 00 00",
          "E-posta: destek@kotanjant.com",
          "Adres: Örnek Mah. Jant Sok. No: 15, İstanbul / Türkiye",
        ],
      },
      {
        heading: "Çalışma Saatleri",
        bullets: ["Hafta içi: 09:00 – 18:00", "Cumartesi: 10:00 – 15:00", "Pazar: Kapalı"],
      },
      {
        heading: "Sipariş ve Kargo Talepleri",
        paragraphs: [
          "Sipariş numaranızı belirterek bize ulaştığınızda talepleriniz öncelikli olarak işleme alınır.",
        ],
      },
    ],
  },

  "garanti-ve-iade": {
    title: "Garanti ve İade",
    description: "Ürün garanti süreleri, iade ve değişim koşulları.",
    intro: "Ürünlerimizin garanti, iade ve değişim koşulları aşağıda belirtilmiştir.",
    sections: [
      {
        heading: "Garanti Koşulları",
        bullets: [
          "Jant kapakları: 12–24 ay üretici garantisi (ürüne göre değişir)",
          "Üretim hatası kaynaklı deformasyon ve çatlama garanti kapsamındadır",
          "Kaza, düşme veya yanlış montaj kaynaklı hasarlar garanti dışıdır",
        ],
      },
      {
        heading: "İade ve Değişim",
        bullets: [
          "Ürünü teslim aldıktan sonra 14 gün içinde iade talebi oluşturabilirsiniz",
          "Ürün kullanılmamış ve orijinal ambalajında olmalıdır",
          "Değişim taleplerinde kargo ücreti firmamıza aittir",
        ],
      },
      {
        heading: "İade Süreci",
        paragraphs: [
          "Hesabım > Sipariş ve İade bölümünden ilgili siparişi seçip destek ekibimize ulaşabilirsiniz. Talebiniz onaylandığında kargo kodu tarafınıza iletilir; ürün bize ulaştıktan sonra ödemeniz 3–5 iş günü içinde iade edilir.",
        ],
      },
    ],
  },

  "kargo-takip": {
    title: "Kargo Takip",
    description: "Sipariş kargo süreçleri ve takip bilgileri.",
    intro:
      "14:00'a kadar verilen siparişler aynı gün kargoya verilir; teslimat süresi 1–4 iş günüdür.",
    sections: [
      {
        heading: "Kargo Süreci",
        bullets: [
          "Sipariş onaylandığında durumu 'Hazırlanıyor' olarak güncellenir",
          "Kargoya verildiğinde 'Kargoda' durumuna geçer ve takip numarası iletilir",
          "Teslim edildiğinde sipariş otomatik olarak 'Teslim Edildi' olur",
        ],
      },
      {
        heading: "Takip Nasıl Yapılır?",
        paragraphs: [
          "Hesabım > Sipariş ve İade bölümünden siparişinizi açarak güncel durumu ve süreç geçmişini anlık olarak görüntüleyebilirsiniz.",
        ],
      },
      {
        heading: "Kargo Ücreti",
        bullets: [
          "1.500 ₺ ve üzeri siparişlerde kargo ücretsizdir",
          "Altındaki siparişlerde 79,90 ₺ sabit ücret uygulanır",
        ],
      },
    ],
  },

  sss: {
    title: "Sıkça Sorulan Sorular",
    description: "Sipariş, kargo, iade ve ürünlerle ilgili sık sorulan sorular.",
    sections: [
      {
        heading: "Doğru jant kapağı ölçüsünü nasıl bulurum?",
        paragraphs: [
          "Lastiğinizin yan duvarındaki ifadenin (ör. 195/65 R15) son iki hanesi jant çapını belirtir. Bu örnekte doğru ölçü 15 inçtir.",
        ],
      },
      {
        heading: "Kapaklar yolda çıkar mı?",
        paragraphs: [
          "Ürünlerimiz çelik klips mekanizmasına sahiptir ve doğru ölçü seçildiğinde yolda çıkmaz. Montaj sırasında kapağın tam oturduğundan emin olun.",
        ],
      },
      {
        heading: "Üyelik zorunlu mu?",
        bullets: [
          "Misafir olarak da alışveriş yapabilirsiniz",
          "Üye olduğunuzda siparişlerinizi hesabınızdan takip edebilirsiniz",
          "Üyelik oluşturmak için e-posta ve şifre yeterlidir",
        ],
      },
      {
        heading: "Siparişimi nasıl takip ederim?",
        paragraphs: [
          "Hesabım > Sipariş ve İade bölümünden sipariş durumunuzu anlık olarak görebilirsiniz.",
        ],
      },
    ],
  },

  "jant-olcu-rehberi": {
    title: "Jant Ölçü Rehberi",
    description: "Aracınıza uygun jant kapağı ölçüsünü bulma rehberi.",
    intro: "Doğru jant kapağını seçmenin anahtarı, jant çapını doğru belirlemektir.",
    sections: [
      {
        heading: "Jant Çapı Nasıl Okunur?",
        bullets: [
          "Lastik yan duvarındaki 'R' harfinden sonraki sayı jant çapıdır (R13, R14, R15...)",
          "Örnek: 185/65 R14 → 14 inç jant",
          "Kapak etiketinde belirtilen ölçü ile lastik ölçüsü uyuşmalıdır",
        ],
      },
      {
        heading: "Popüler Ölçüler ve Araç Tipleri",
        bullets: [
          "13 inç: Kompakt ve şehir içi araçlar",
          "14 inç: Hatchback ve sedan modeller",
          "15 inç: Sedan ve geniş gövdeli araçlar",
          "16 inç ve üzeri: SUV ve hafif ticari araçlar",
        ],
      },
      {
        heading: "Montaj İpuçları",
        bullets: [
          "Montaj öncesi jant yüzeyini temizleyin",
          "Kapağı klipslere denk getirip eşit baskı uygulayın",
          "Montaj sonrası kapağı elle kontrol ederek oturduğundan emin olun",
        ],
      },
    ],
  },

  gizlilik: {
    title: "Gizlilik Politikası",
    description: "Kişisel verilerin işlenmesi ve gizlilik politikası.",
    intro:
      "Kotanjant olarak kişisel verilerinizin güvenliğine önem veriyoruz. Bu politika, verilerinizin nasıl toplandığını ve kullanıldığını açıklar.",
    sections: [
      {
        heading: "Toplanan Veriler",
        bullets: [
          "Kimlik ve iletişim bilgileri (ad, e-posta, telefon)",
          "Teslimat adresi bilgileri",
          "Sipariş ve işlem geçmişi",
        ],
      },
      {
        heading: "Verilerin Kullanımı",
        bullets: [
          "Siparişlerin işlenmesi ve teslimatın gerçekleştirilmesi",
          "Müşteri desteği sağlanması",
          "Onayınız doğrultusunda kampanya ve bilgilendirme iletişimi",
        ],
      },
      {
        heading: "Veri Güvenliği",
        paragraphs: [
          "Verileriniz şifreli bağlantılar (SSL) üzerinden iletilir; ödeme kartı bilgileri sistemimizde saklanmaz.",
        ],
      },
    ],
  },

  kvkk: {
    title: "KVKK Aydınlatma Metni",
    description: "6698 sayılı KVKK kapsamında aydınlatma metni.",
    intro:
      "6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') uyarınca veri sorumlusu Kotanjant Jant & Aksesuar'dır.",
    sections: [
      {
        heading: "İşleme Amaçları",
        bullets: [
          "Sözleşmenin kurulması ve ifası",
          "Hukuki yükümlülüklerin yerine getirilmesi",
          "Müşteri ilişkilerinin yönetimi",
        ],
      },
      {
        heading: "Haklarınız",
        bullets: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
          "İşlenmişse buna ilişkin bilgi talep etme",
          "Düzeltilmesini veya silinmesini isteme",
          "İşlemeye itiraz etme",
        ],
      },
      {
        heading: "Başvuru",
        paragraphs: [
          "Haklarınıza ilişkin taleplerinizi destek@kotanjant.com adresine iletebilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.",
        ],
      },
    ],
  },

  "cerez-politikasi": {
    title: "Çerez Politikası",
    description: "Web sitemizde kullanılan çerezler ve amaçları.",
    intro: "Sitemizde deneyiminizi iyileştirmek için çerezler kullanılmaktadır.",
    sections: [
      {
        heading: "Çerez Türleri",
        bullets: [
          "Zorunlu çerezler: Oturum ve güvenlik için gereklidir",
          "Tercih çerezleri: Dil ve görüntüleme ayarlarınızı hatırlar",
          "Analitik çerezler: Site kullanımını anonim olarak ölçer",
        ],
      },
      {
        heading: "Çerezleri Yönetme",
        paragraphs: [
          "Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin devre dışı bırakılması bazı işlevleri etkileyebilir.",
        ],
      },
    ],
  },
};
