import type { PageContent } from '@/lib/content';

export const privacy: PageContent = {
  id: 6,
  slug: '/privacy/',
  backendLayout: '8',
  meta: {
    title: 'Leonaara - Information on data privacy',
    description: 'Our privacy policy shows how Leonaara protects and processes your personal data.',
    ogTitle: 'Privacy',
    ogDescription: 'Our privacy policy shows how Leonaara protects and processes your personal data.',
    ogImage: null,
    twitterTitle: 'Privacy',
    twitterDescription: 'Our privacy policy shows how Leonaara protects and processes your personal data.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: true, noFollow: false },
  },
  columns: {
    colPos0: [
      {
        id: 65,
        type: 'mask_footerpagetext',
        appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          title: 'Privacy',
          // Controller details taken from the live leonaara.com privacy page:
          // Leonaara is an Indian real-estate business based in Hyderabad --
          // address/phone/email below are transcribed from that real page.
          text: '<h2>Name and contact details of the controller</h2>\n<p><strong>Leonaara</strong><br>1st Floor, Prime Titania, Above ICICI Bank<br>Mokila, Hyderabad-501203</p>\n<p>Phone: <a href="tel:9121912122">9121912122</a><br><a href="mailto:hello@leonaara.com">hello@leonaara.com</a></p>',
        },
      },
      {
        id: 10,
        type: 'hanthaincludepage_includepage',
        appearance: { layout: 'default', frameClass: 'container', spaceBefore: '', spaceAfter: '' },
        content: {
          // Rewritten to match the actual sections and wording found on the
          // live leonaara.com/privacy/ page (an Indian real-estate business
          // in Hyderabad) -- section order, headings, and quoted phrasing
          // below follow what's live on that page.
          html: "<h2>Introduction</h2>\r\n<p>Welcome to Leonaara. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our website and services.</p>\r\n<h2>Personal Information We Collect</h2>\r\n<p>To facilitate property transactions, provide property listings, and deliver related services, we may collect the following categories of personal information:</p>\r\n<ul><li>Contact details, such as your name, address, phone number, and email address</li><li>Identification numbers, including PAN and Aadhaar</li><li>Financial information, such as bank account details</li><li>Property details and preferences relevant to your enquiry</li><li>Demographic data</li></ul>\r\n<h2>Technical Information</h2>\r\n<p>When you visit our website, we automatically collect certain technical information, including your IP address, browser type, and operating system, along with referral URLs and device identifiers.</p>\r\n<h2>How We Collect Information</h2>\r\n<p>We collect information directly from you when you submit it to us, automatically through cookies and similar tracking technologies, and in some cases from third-party sources.</p>\r\n<h2>How We Use Your Information</h2>\r\n<p>The information we collect is used for service delivery, communication with you, marketing, improving our services, record-keeping, personalisation, and legal compliance.</p>\r\n<h2>Disclosure of Your Information</h2>\r\n<p>We will not sell, distribute, or lease your personal information to third parties unless we have your explicit permission or are required to do so by law. We may disclose information to legal authorities where required, and to relevant parties in connection with a corporate transaction.</p>\r\n<h2>Security Measures</h2>\r\n<p>We have implemented appropriate technical and organisational measures to safeguard your personal data against loss, misuse, or unauthorised access.</p>\r\n<h2>Cookies</h2>\r\n<p>Cookies are small files placed on your device that help us remember your preferences. Our website uses cookies to enhance your experience and to analyse site traffic. You can control or disable cookies through your browser settings.</p>\r\n<h2>Communication Consent</h2>\r\n<p>By providing your contact details, you consent to Leonaara and its authorised partners contacting you via phone call, SMS, email, or WhatsApp regarding your enquiry and related property services.</p>\r\n<h2>Your Rights</h2>\r\n<p>You may request access to, correction of, or deletion of your personal information, and you may object to or request restriction of its processing, as well as request its portability, by contacting us using the details below.</p>\r\n<h2>Policy Updates</h2>\r\n<p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page.</p>\r\n<h2>Contact Us</h2>\r\n<p>If you have any questions about this Privacy Policy, please contact us:</p>\r\n<p><strong>Leonaara</strong><br>1st Floor, Prime Titania, Above ICICI Bank<br>Mokila, Hyderabad-501203</p>\r\n<p>Phone: <a href=\"tel:9121912122\">9121912122</a><br><a href=\"mailto:hello@leonaara.com\">hello@leonaara.com</a></p>",
        },
      },
    ],
  },
};
