import { expect } from 'chai';
import { Model, models } from 'mongoose';
import Activity from '../../../../src/mongoDB/models/activity';
import { rawActivities } from '../../../data';

describe('(mongoDB) Activity model', function () {
    let rawActivity = rawActivities.test_activity_1;

    it('should create new Activity model', function () {
        const activity = new Activity(rawActivity);
        expect(activity).to.be.instanceOf(Model);
    });
    it('should correctly parse data', function () {
        const activity = new Activity(rawActivity);
        expect(activity).to.like(test_activity);
    });
    it('should change _id to id and remove _v when toJSON method called', function () {
        const activity = new Activity(rawActivity);
        const activityJSON = activity.toJSON();
        expect(activityJSON._v).undefined;
        expect(activityJSON._id).undefined;
        expect(typeof activityJSON.id).to.be.equal('string');
    });
    it("shoud create add Activity model to models if it doesn't exist", async function () {
        delete models.Activity;
        const activity = new Activity(rawActivity);
        expect(activity).to.be.instanceOf(Model);
    });
});

var test_activity = {
    name: 'test_activity_1',
    distance: 8658,
    moving_time: 2654,
    elapsed_time: 2725,
    total_elevation_gain: 64,
    type: 'Run',
    workout_type: 0,
    utc_offset: -300,
    start_latlng: { lat: 36.197174, lng: -94.141822 },
    end_latlng: { lat: 36.197205, lng: -94.141947 },
    location_city: null,
    location_state: null,
    location_country: 'United States',
    location_country_code: null,
    map: {
        id: 'a5028628944',
        polyline:
            'iw|{Elar}PCFDDAn@CJGdA?JDFFD\\@`@KFIHAn@JX@r@GFBDHD\\CRAvCC`@If@@bCD`@K^@b@Hd@CF?d@B`@CNLJQDGXC`BIdAFt@?PKJs@AOC_@]@FGBaABOJIJI`@Bz@FV@\\?tBF\\Ev@EJAl@@FITO?KBUEUFMKK?SISEO@GCm@IaBDm@Gs@AM@EFC?KCKASBOCoACoAHsBSk@@_@DsBO[FaCS]FWCWBOHMLITGTGx@Bh@Hx@@pAGzB@r@CfADz@GVMbCApA@~@ELEj@?n@U~C@x@Cj@UhAH`BG~@XdABlBE|@S\\QHc@@WCKKCSPaA@UAGIOGAG@OHIVKjAKV_Ab@{@n@_@HWJSVm@dAQ@YEM?WIM?g@D_@?c@Q]E{Ad@K@I?ECCGESAo@ASBk@Ac@HU@K?s@Jg@BUA]KWMO]GY?ECQ_@WSOSCQAeAF}ACIQGg@L_BHw@LMAUI_@AEBOL[@a@Kk@Cs@Ge@AWG[?WFSAK@GAUDs@GKFi@r@g@rAQ\\UZIXQ`A_@dAIJKBc@FSTEN@p@CPGNc@P[C[Mq@m@MQKa@Cg@@Ut@{Bd@oARWD[b@uARc@^i@ZYl@Oh@An@INGLKFQM_ADMDEHERA|@BPGHU@c@CSGOIgBEQ@KFOZKf@IDEP]BMP{B?SGMg@q@WKc@EQBY?[GSKaAcBEYQ]Iu@KSCOIMBEBc@Fe@?OA_@O{@C]Dm@JSXSp@Od@G`@HT@n@GdAJd@Gj@Dx@EZ@z@PvA_@J?j@B^NTPTDH?TGZSZYLENEn@Gd@KF?pAcARIB@VEf@MJE^e@Zs@Lg@Vc@NUROJANOFo@Pm@Fk@DSHKRORMHAP[B]Ek@@OL_@Za@\\_AP_ATy@Do@PwAJUz@eAVk@NSFS?qASaA?QFUPU^Sh@Gf@SVGRMJMHYOo@?e@FYD?Nc@NYNKREvAK^_@NW@I\\g@^?H@HB@JnAg@pAQ`@@`@Nf@FX?h@WrAgAbAo@p@Kd@DbBCl@BTAZIz@o@Xc@Bg@P?NUDETaAZiCPWDKNMr@Ol@]RGFBBJ@h@Hh@LT^ZJTX`ABTBbAEb@G@Cl@CLEN[ZGN@l@I`B@lBKfAIVHhABh@C\\@xAAf@ERCdCIDq@G_@J]AYIi@AOBO?IAEGCSJw@@w@',
        resource_state: 3,
        summary_polyline:
            'iw|{Elar}PCFDDAn@CJGdA?JDFFD\\@`@KFIHAhALr@GFBDHD\\CRAvCC`@If@@bCD`@K^@b@Hd@CF?d@B`@CNLJQDGXC`BIdAFt@?PKJs@AOC_@]@FGBaABOJIJI`@Bz@FV@\\?tBF\\Ev@EJAl@@FITO?KBUEUFMKK?SISEO@GCm@IaBDm@Gs@AM@EFC?WESBOCoACoAHsBSk@@_@DsBO[FaCS]FWCWBOHMLITGTGx@Bh@Hx@@pAGzB@r@CfADz@GVMbCApA@~@ELEj@?n@U~C@x@Cj@UhAH`BG~@XdABlBE|@S\\QHc@@WCKKCSPaA@UAGIOGAG@OHIVKjAKV_Ab@{@n@_@HWJSVm@dAQ@YEM?WIM?g@D_@?c@Q]E{Ad@U@ECCGESAo@ASBk@Ac@HU@K?s@Jg@BUA]KWMO}@KQ_@WSOSCQAeAF}ACIQGg@L_BHw@LMAUI_@AEBOL[@a@Kk@Cs@Ge@AWG[?WFg@AUDs@GKFi@r@g@rAQ\\UZIXQ`A_@dAIJKBc@FSTEN@p@CPGNc@PSAYI{@s@Q[GWAw@DUXw@H]p@eBRWD[ZgAJUn@eAZYl@Oh@An@INGLKFQM_ADMDEHERA|@BPGHU@c@CSGOIgBEQ@KFOZKf@IDEP]BMP{B?SGMg@q@WKc@Ek@B[GSKaAcBEYQ]Iu@KSCOIMBEBc@Fe@?OA_@O{@C]Dm@JSXSp@Od@G`@HT@n@GdAJd@Gj@Dx@EZ@z@PvA_@J?j@B^NTPTDH?TGZSZYLENEn@Gd@KF?pAcARIB@VEf@MJE^e@Zs@Lg@Vc@NUROJANOFo@Pm@Fk@DSHKRORMHAP[B]Ek@@OL_@Za@\\_AP_ATy@Do@PwAJUz@eAVk@NSFS?qASaA?QFUPU^Sh@Gf@SVGRMJMHYOo@?e@FYD?Nc@NYNKREvAK^_@NW@I\\g@^?H@HB@JnAg@pAQ`@@`@Nf@FX?h@WrAgAbAo@p@Kd@DbBCl@BTAZIz@o@Xc@Bg@P?NUDETaAZiCPWDKNMx@Sl@]LCD?DN@h@Hh@LT^ZJTX`ABTBbAEb@G@Cl@CLEN[ZGN@l@I`B@lBKfAIVHhABh@C\\@xAAf@ERCdCIDq@G_@J]AYIi@A_@BIAEGCSJw@@w@',
    },
    average_speed: 3.262,
    max_speed: 7.4,
    elev_high: 405.2,
    elev_low: 372.1,
    weather: null,
    start_date: new Date(
        'Sun Mar 28 2021 16:14:38 GMT-0500 (‌⁠‍⁠Central Daylight Time)'
    ),
    start_date_local: new Date(
        'Sun Mar 28 2021 11:14:38 GMT-0500 (‌⁠‍⁠Central Daylight Time)'
    ),
    timezone: '(GMT-06:00) America/Chicago',
    best_efforts: [
        {
            name: '400m',
            elapsed_time: 107,
            distance: 400,
            start_index: 169,
            end_index: 266,
        },
        {
            name: '1/2 mile',
            elapsed_time: 223,
            distance: 805,
            start_index: 942,
            end_index: 1134,
        },
        {
            name: '1k',
            elapsed_time: 281,
            distance: 1000,
            start_index: 942,
            end_index: 1184,
        },
        {
            name: '1 mile',
            elapsed_time: 466,
            distance: 1609,
            start_index: 941,
            end_index: 1339,
        },
        {
            name: '2 mile',
            elapsed_time: 959,
            distance: 3219,
            start_index: 8,
            end_index: 838,
        },
        {
            name: '5k',
            elapsed_time: 1493,
            distance: 5000,
            start_index: 44,
            end_index: 1335,
        },
    ],
    month: 3,
    year: 2021,
};
