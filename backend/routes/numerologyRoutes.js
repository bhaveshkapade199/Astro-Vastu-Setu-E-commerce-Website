const express = require('express');
const router = express.Router();
const NumerologyOrder = require('../models/NumerologyOrder');
const Product = require('../models/Product');
const { authenticateAdmin } = require('../middleware/auth');

// Single-digit reduction helper
function reduceToSingleDigit(num) {
    while (num > 9) {
        num = num.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return num;
}

// Planetary metadata for numbers 1 to 9
const numerologyData = {
    1: {
        rulingPlanet: 'Sun (सूर्य)',
        luckyColor: 'Yellow / Gold / Orange',
        friendlyNumbers: [1, 2, 3, 5, 9],
        analysisText: 'तुम्ही नैसर्गिक नेतृत्वगुण, आत्मविश्वास आणि दृढनिश्चयाचे धनी आहात. सूर्य ग्रहाचा प्रभाव तुम्हाला यश, प्रतिष्ठा आणि प्रगती मिळवून देतो.'
    },
    2: {
        rulingPlanet: 'Moon (चंद्र)',
        luckyColor: 'White / Silver / Cream',
        friendlyNumbers: [1, 2, 4, 7],
        analysisText: 'तुम्ही अत्यंत संवेदनशील, कल्पक आणि शांत स्वभावाचे आहात. चंद्र ग्रहाचा प्रभाव तुमच्यात आंतरिक शांती, अंतःस्फूर्ती आणि गोड संभाषण निर्माण करतो.'
    },
    3: {
        rulingPlanet: 'Jupiter (गुरु / बृहस्पती)',
        luckyColor: 'Yellow / Saffron',
        friendlyNumbers: [1, 3, 5, 7, 8, 9],
        analysisText: 'तुम्ही ज्ञानी, सकारात्मक आणि उच्च विचारसरणीचे आहात. देवगुरु बृहस्पतीचा प्रभाव तुम्हाला समृद्धी, ज्ञान आणि समाजात मानसन्मान देतो.'
    },
    4: {
        rulingPlanet: 'Rahu (राहु)',
        luckyColor: 'Electric Blue / Grey / Black',
        friendlyNumbers: [1, 2, 6, 7, 8],
        analysisText: 'तुम्ही व्यावहारिक, कष्टाळू आणि वेगळा विचार करणारे आहात. राहुच्या प्रभावाने तांत्रिक ज्ञान आणि अचानक प्रगती घडते; नकारात्मक ऊर्जेपासून संरक्षणाची गरज असते.'
    },
    5: {
        rulingPlanet: 'Mercury (बुध)',
        luckyColor: 'Green / Emerald',
        friendlyNumbers: [1, 5, 6],
        analysisText: 'तुम्ही अत्यंत बुद्धिमान, चतुर आणि व्यापार कौशल्यात कुशल आहात. बुध ग्रहाचा प्रभाव व्यवसायात मोठी भरभराट आणि जलद प्रगती घडवून आणतो.'
    },
    6: {
        rulingPlanet: 'Venus (शुक्र)',
        luckyColor: 'Pink / White / Light Blue',
        friendlyNumbers: [3, 6, 9],
        analysisText: 'तुम्ही कलात्मक, प्रेमळ आणि ऐश्वर्यसंपन्न स्वभावाचे आहात. शुक्र ग्रहाचा प्रभाव सुख-सुविधा, प्रेमात यश आणि आकर्षण वाढवतो.'
    },
    7: {
        rulingPlanet: 'Ketu (केतू)',
        luckyColor: 'White / Multicolor / Violet',
        friendlyNumbers: [1, 2, 4, 7],
        analysisText: 'तुम्ही अध्यात्मिक, विश्लेषक आणि अंतर्मुख व्यक्तिमत्त्वाचे आहात. केतूच्या प्रभावाने तीव्र स्मरणशक्ती, मानसिक शांती आणि चक्र संतुलन अत्यंत लाभदायक ठरते.'
    },
    8: {
        rulingPlanet: 'Saturn (शनी)',
        luckyColor: 'Dark Blue / Black / Dark Grey',
        friendlyNumbers: [3, 5, 7, 8],
        analysisText: 'तुम्ही अत्यंत शिस्तप्रिय, सहनशील आणि दीर्घकालीन संपत्ती निर्माण करणारे आहात. शनी ग्रहाच्या आशीर्वादाने कष्टाचे फळ आणि आर्थिक स्थिरता प्राप्त होते.'
    },
    9: {
        rulingPlanet: 'Mars (मंगळ)',
        luckyColor: 'Red / Coral / Bright Orange',
        friendlyNumbers: [1, 3, 5, 9],
        analysisText: 'तुम्ही ऊर्जेने ओसंडून वाहणारे, धाडसी आणि उत्साही आहात. मंगळ ग्रहाचा प्रभाव तुम्हाला सर्व संकटांवर मात करण्याचे शौर्य व संरक्षण प्रदान करतो.'
    }
};

// Intelligently match our product catalog based on Mulank/Bhagyank and chosen purpose
function pickRecommendedBracelet(mulank, bhagyank, purpose) {
    const p = (purpose || '').toLowerCase();

    // 1. Check purpose-driven preference first
    if (p.includes('wealth') || p.includes('prosperity') || p.includes('पैसा')) {
        if (mulank === 8 || bhagyank === 8) {
            return {
                id: 8,
                name: 'Pyrite Bracelet (Money Magnet)',
                image: '/uploads/bracelet-pyrite.jpeg',
                price: 899,
                reason: 'तुमच्या जन्मतारखेनुसार मूल्यांक 8 / भाग्यांक व ध्येयासाठी पायराईट ब्रेसलेट हे संपत्ती आणि नवीन आर्थिक संधी आकर्षित करण्यासाठी सर्वात शक्तिशाली मानले जाते.',
                benefits: ['आर्थिक वृद्धी आणि पैशाचा ओघ आकर्षित करणे', 'नव्या व्यावसायिक संधी निर्माण करणे', 'आत्मविश्वास आणि पैशाचे नियोजन सुधारणे'],
                wearingInstructions: 'उजव्या हाताच्या मनगटावर (Right Wrist) गुरुवारी किंवा शनिवारी सकाळी घालावे.'
            };
        } else {
            return {
                id: 2,
                name: 'Citrine Bracelet (Merchant Stone)',
                image: '/uploads/bracelet-citrine.jpeg',
                price: 699,
                reason: 'तुमच्या Birth Date आणि धनाकर्षणाच्या उद्देशासाठी सिट्रीन (Citrine) हे "मर्चंट स्टोन" म्हणून सर्वोत्तम अनुकूल ठरते. हे तिजोरीत धनवृद्धी करण्यासाठी प्रख्यात आहे.',
                benefits: ['कष्टाचे योग्य आर्थिक मोबदल्यात रूपांतर', 'सकारात्मक ऊर्जा व समृद्धी वाढवणे', 'व्यापारात यश आणि भाग्य वृद्धी'],
                wearingInstructions: 'उजव्या हाताच्या मनगटावर (Right Wrist) गुरुवारी सकाळी सूर्योदयानंतर परिधान करावे.'
            };
        }
    }

    if (p.includes('career') || p.includes('success') || p.includes('नोकरी')) {
        return {
            id: 4,
            name: 'Tiger Eye Bracelet',
            image: '/uploads/bracelet-tigereye.jpeg',
            price: 799,
            reason: 'तुमच्या जन्म अंकांनुसार करिअर व प्रगतीसाठी टायगर आय (Tiger Eye) ब्रेसलेट सर्वोत्तम आहे. हे धैर्य, फोकस आणि योग्य निर्णयक्षमता प्रदान करते.',
            benefits: ['कामाच्या ठिकाणी आत्मविश्वास व एकाग्रता वाढवणे', 'भय व नकारात्मक विचार दूर करणे', 'व्यवसाय आणि नोकरीत प्रमोशन/यश'],
            wearingInstructions: 'उजव्या हाताच्या मनगटावर (Right Wrist) मंगळवारी किंवा रविवारी सकाळी घालावे.'
        };
    }

    if (p.includes('love') || p.includes('relationship') || p.includes('प्रेम')) {
        return {
            id: 6,
            name: 'Rose Quartz Bracelet',
            image: '/uploads/bracelet-rosequartz.jpeg',
            price: 699,
            reason: 'तुमच्या जन्मतारखेच्या ऊर्जेला प्रेमाच्या आणि नातेसंबंधांच्या संतुलनासाठी रोज क्वार्ट्झ (Rose Quartz) हे "हार्ट चक्राचे रत्न" सर्वात उत्तम पूरक आहे.',
            benefits: ['पती-पत्नी आणि कौटुंबिक नातेसंबंधात गोडवा व प्रेम', 'मानसिक ताण कमी करून आंतरिक आनंद', 'स्वतःबद्दलचा आदर व आकर्षण वाढवणे'],
            wearingInstructions: 'डाव्या हाताच्या मनगटावर (Left Wrist - Receiving Hand) शुक्रवारी सकाळी परिधान करावे.'
        };
    }

    if (p.includes('peace') || p.includes('relaxation') || p.includes('शांती')) {
        return {
            id: 3,
            name: 'Amethyst Bracelet',
            image: '/uploads/bracelet-amethyst.jpeg',
            price: 699,
            reason: 'तुमच्या अंकांनुसार मानसिक शांतता व तणावमुक्तीसाठी अमेथिस्ट (Amethyst) ब्रेसलेट सर्वोत्तम ठरते. हे क्राउन चक्र जागृत करून निद्रानाश व भीती दूर करते.',
            benefits: ['अतिविचार (Overthinking) व तणावापासून मुक्ती', 'गाढ व शांत झोप मिळण्यास मदत', 'ध्यान (Meditation) व आध्यात्मिक उन्नती'],
            wearingInstructions: 'डाव्या हाताच्या मनगटावर (Left Wrist) सोमवारी किंवा शनिवारी संध्याकाळी परिधान करावे.'
        };
    }

    if (p.includes('protection') || p.includes('संरक्षण') || p.includes('नजर')) {
        return {
            id: 5,
            name: 'Black Tourmaline Bracelet',
            image: '/uploads/bracelet-blacktourmaline.jpeg',
            price: 899,
            reason: 'तुमच्या Numerology प्रभावानुसार नजरदोष, नकारात्मक लोक आणि इव्हिल आयपासून संरक्षणासाठी ब्लॅक टर्मेलीन हे अभेद्य आध्यात्मिक कवच मानले जाते.',
            benefits: ['नजरदोष व वाईट स्पंदनांपासून संपूर्ण रक्षण', 'घर व कार्यालयातील नकारात्मक ऊर्जा शोषून घेणे', 'सुरक्षितता व मानसिक स्थिरता'],
            wearingInstructions: 'डाव्या हाताच्या मनगटावर (Left Wrist) शनिवारी किंवा मंगळवारी परिधान करावे.'
        };
    }

    // Default: Overall Well-being / 7 Chakra / Rudraksha
    if (mulank === 9 || bhagyank === 9) {
        return {
            id: 10,
            name: 'Panchmukhi Rudraksha Bracelet',
            image: '/uploads/bracelet-rudraksha.jpeg',
            price: 899,
            reason: 'तुमच्या जन्मतारखेतील मंगळ/ऊर्जा प्रभावासाठी पंचमुखी रुद्राक्ष ब्रेसलेट हे आध्यात्मिक आरोग्य, आरोग्य आणि संरक्षक ढाल म्हणून उत्तम काम करते.',
            benefits: ['रक्तदाब व तणाव नियंत्रित ठेवणे', 'महादेवांचा आशीर्वाद व आध्यात्मिक तेज', 'सर्वांगीण आरोग्य व सकारात्मक ऊर्जा'],
            wearingInstructions: 'सोमवारी सकाळी स्नान करून ॐ नमः शिवाय मंत्राने परिधान करावे.'
        };
    }

    return {
        id: 1,
        name: '7 Chakra Healing Bracelet',
        image: '/uploads/bracelet-7chakra.jpeg',
        price: 699,
        reason: 'तुमच्या Birth Date व संपूर्ण ऊर्जा संतुलनासाठी 7 चक्रांचे मूळ नैसर्गिक खडे असलेले ब्रेसलेट सर्वोत्तम आहे, जे शरीराची सर्व ७ ऊर्जा केंद्रे संतुलित ठेवते.',
        benefits: ['शरीरातील सर्व ७ मुख्य चक्रांचे संतुलन', 'संपूर्ण शारीरिक, मानसिक व आध्यात्मिक कल्याण', 'सकारात्मक उर्जेचा निरंतर संचार'],
        wearingInstructions: 'कोणत्याही शुभ दिवशी सकाळी उजव्या किंवा डाव्या हातावर परिधान करावे.'
    };
}

// Parse date string into day, month, year
function parseBirthDate(dobStr) {
    let day = 1, month = 1, year = 2000;
    if (!dobStr) return { day, month, year };

    // Format YYYY-MM-DD
    if (dobStr.includes('-')) {
        const parts = dobStr.split('-');
        if (parts[0].length === 4) {
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            day = parseInt(parts[2], 10);
        } else {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
        }
    } else if (dobStr.includes('/')) {
        const parts = dobStr.split('/');
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10);
        year = parseInt(parts[2], 10);
    }
    return { day: day || 1, month: month || 1, year: year || 2000 };
}

// POST create and generate Numerology Report (Public)
router.post('/', async (req, res) => {
    try {
        const { name, dob, whatsapp, email, purpose, paymentMethod, transactionId } = req.body;

        if (!name || !dob || !whatsapp || !purpose) {
            return res.status(400).json({ error: 'नाव, जन्मतारीख, व्हॉट्सअ‍ॅप नंबर आणि उद्देश आवश्यक आहेत.' });
        }

        // Calculate Numerology
        const { day, month, year } = parseBirthDate(dob);
        const mulank = reduceToSingleDigit(day);
        const totalDigitsSum = (day + month + year).toString().split('').reduce((s, d) => s + parseInt(d, 10), 0);
        const bhagyank = reduceToSingleDigit(totalDigitsSum);

        const planetInfo = numerologyData[mulank] || numerologyData[1];
        const braceletRec = pickRecommendedBracelet(mulank, bhagyank, purpose);

        // Generate Report ID NB-XXXXXX
        const reportId = 'NB-' + Math.floor(100000 + Math.random() * 900000);

        const newOrder = new NumerologyOrder({
            reportId,
            customer: {
                name: name.trim(),
                dob: dob.trim(),
                whatsapp: whatsapp.trim(),
                email: email ? email.trim() : '',
                purpose: purpose.trim()
            },
            numerology: {
                mulank,
                bhagyank,
                rulingPlanet: planetInfo.rulingPlanet,
                friendlyNumbers: planetInfo.friendlyNumbers,
                luckyColor: planetInfo.luckyColor,
                analysisText: planetInfo.analysisText
            },
            recommendation: {
                braceletId: braceletRec.id,
                braceletName: braceletRec.name,
                braceletImage: braceletRec.image,
                braceletPrice: braceletRec.price,
                reason: braceletRec.reason,
                benefits: braceletRec.benefits,
                wearingInstructions: braceletRec.wearingInstructions
            },
            payment: {
                amount: 51,
                status: 'Paid',
                paymentMethod: paymentMethod || 'Online / UPI',
                transactionId: transactionId || ('pay_' + Math.random().toString(36).substring(2, 10))
            },
            reportStatus: 'Generated'
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Numerology Report generated successfully!',
            reportId,
            order: newOrder
        });
    } catch (err) {
        console.error('Error generating numerology report:', err);
        res.status(500).json({ error: 'Failed to generate report: ' + err.message });
    }
});

// GET single report by reportId (Public - for viewing report)
router.get('/:reportId', async (req, res) => {
    try {
        const order = await NumerologyOrder.findOne({ reportId: req.params.reportId });
        if (!order) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all numerology orders (Protected - Admin)
router.get('/', authenticateAdmin, async (req, res) => {
    try {
        const orders = await NumerologyOrder.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch numerology reports: ' + err.message });
    }
});

// PUT update status (Protected - Admin)
router.put('/:reportId/status', authenticateAdmin, async (req, res) => {
    try {
        const { reportStatus, braceletOrdered } = req.body;
        const updateData = {};
        if (reportStatus) updateData.reportStatus = reportStatus;
        if (braceletOrdered !== undefined) updateData.braceletOrdered = braceletOrdered;

        const updated = await NumerologyOrder.findOneAndUpdate(
            { reportId: req.params.reportId },
            { $set: updateData },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Report not found' });
        }

        res.json({ success: true, message: 'Status updated', order: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE report (Protected - Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const result = await NumerologyOrder.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Report not found' });
        }
        res.json({ success: true, message: 'Report deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
