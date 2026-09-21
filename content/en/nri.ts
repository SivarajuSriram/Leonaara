import type { PageContent } from '@/lib/content';

// New page per the user's explicit request: "create a new page, it is for
// NRI. The theme shall match our current thing." Built entirely from
// existing components (Hero/ImgText/Accordions) so it inherits the site's
// existing look with no new styling of its own -- same pattern every other
// page on this site follows.
export const nri: PageContent = {
  id: 9300,
  slug: '/nri/',
  backendLayout: 'defaultLayout',
  meta: {
    title: 'NRI Corner - Leonaara',
    description: 'A guide for Non-Resident Indians investing in Leonaara: eligibility, documentation, power of attorney, repatriation of funds and how to buy from abroad.',
    ogTitle: 'NRI Corner',
    ogDescription: 'A guide for Non-Resident Indians investing in Leonaara: eligibility, documentation, power of attorney, repatriation of funds and how to buy from abroad.',
    ogImage: null,
    twitterTitle: 'NRI Corner',
    twitterDescription: 'A guide for Non-Resident Indians investing in Leonaara: eligibility, documentation, power of attorney, repatriation of funds and how to buy from abroad.',
    twitterImage: null,
    twitterCard: 'summary',
    robots: { noIndex: false, noFollow: false },
  },
  columns: {
    colPos0: [
      {
        id: 9301, type: 'mask_hero', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          herolayout: 'subpage', title: 'FOR OUR GLOBAL FAMILY', titleh2: 'NRI Corner', titleimg: '',
          text: '<p>Investing in a home back in India shouldn’t mean navigating it alone, from wherever you are. This is a straightforward guide to buying at Leonaara as a Non-Resident Indian, OCI or PIO cardholder: what you’re eligible for, what you’ll need, and how the whole process works from a distance.</p>',
          img: [{ src: '/images/leonaara-nri-family-trees.jpg', width: 3058, height: 1720, mime: 'image/jpeg', title: null, alt: 'A father lifting his young daughter into the air as the mother looks on, in a sunlit park beneath large old trees', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }],
          sideimg: [], imgsummer: [], sideimgsummer: [],
        },
      },
      {
        id: 9302, type: 'mask_imgtext', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          title: 'RETURN TO YOUR ROOTS,<br>\r\nON YOUR TERMS.',
          text: '<p>Being miles away shouldn’t mean being out of touch with your investment. Our NRI services are designed to make owning property in India simpler, more transparent and more convenient; from choosing the right home to completing documentation and taking possession.</p><p>With trusted processes, expert assistance and end-to-end support, we help you make an informed property decision, even when you’re not physically here.</p><p>Because distance should never come between you and a place you can call your own.</p>',
          imgleft: [{ src: '/images/leonaara-nri-lakeside-sunrise.jpg', width: 2730, height: 1536, mime: 'image/jpeg', title: null, alt: 'A couple sitting together on a lakeside bench at sunrise, mist rising over the water and rolling hills', crop: { default: { x: 0, y: 0, width: 1, height: 1 }, mobile: { x: 0, y: 0, width: 1, height: 1 } } }],
          imgright: [],
          imgleftsummer: [], imgrightsummer: [],
        },
      },
      {
        id: 9303, type: 'mask_accordions', appearance: { layout: 'default', frameClass: 'default', spaceBefore: '', spaceAfter: '' },
        content: {
          title: '<span style=\'font-size:0.85em;white-space:nowrap;\'>What You’ll Need</span>', text: '',
          accordion: [
            {
              uid: '9303-1', title: ' Who can purchase property in India as an NRI?', info: '',
              text: '<p>NRIs and eligible Persons of Indian Origin (PIOs)/OCI cardholders can generally purchase residential and commercial property in India, subject to applicable laws and regulations. The rules differ for agricultural land, plantation property and farmhouses.</p>',
              linktext: '', link: '',
            },
            {
              uid: '9303-2', title: 'Can I buy a property in Hyderabad without being physically present in India?', info: '',
              text: '<p>Yes. An NRI can manage several parts of the property-buying process remotely. Depending on the transaction, a Power of Attorney may also be used to authorise a representative in India to carry out specific formalities on their behalf.</p><p>Our team can assist you through the process and keep you updated at every stage.</p>',
              linktext: '', link: '',
            },
            {
              uid: '9303-3', title: 'How can I make payment for a property in India as an NRI?', info: '',
              text: '<p>Payments for eligible property purchases can generally be made through permitted banking channels, including inward remittances through normal banking channels and eligible NRE/NRO/FCNR accounts, subject to applicable RBI regulations.</p><p>The exact payment structure may depend on your transaction and banking arrangement.</p>',
              linktext: '', link: '',
            },
            {
              uid: '9303-4', title: 'Can an NRI get a home loan in India?', info: '',
              text: "<p>Yes. NRIs can be eligible for housing loans in India through authorised banks and housing finance institutions, subject to the lender's eligibility criteria, documentation, income assessment and applicable regulations.</p><p>Our team at Leonaara can help you understand the property-related requirements involved in the process.</p>",
              linktext: '', link: '',
            },
            {
              uid: '9303-5', title: 'Can I attend a virtual property tour from abroad?', info: '',
              text: '<p>Yes. Our team at Leonaara can arrange a personalised virtual tour so you can explore the project, amenities, specifications and available options without having to travel to India.</p>',
              linktext: '', link: '',
            },
            {
              uid: '9303-6', title: ' What documents will I need as an NRI to purchase a property?', info: '',
              text: '<p>Typically, documents such as a valid passport, PAN card, address proof and relevant NRI/OCI documentation may be required. Additional documentation can depend on your purchase, financing and legal requirements.</p>',
              linktext: '', link: '',
            },
          ],
        },
      },
    ],
  },
};
