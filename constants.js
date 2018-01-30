getNavPlaneSet = function() {
    var NAV = new navPlaneSet(new navPlane('p01',	-260, -180,	 -80, 120,	+0,+0,'px')); // 01
    NAV.addPlane(new navPlane('p02', -260, -180,	 120, 200,	+0,+20,'py')); 	// 02
    NAV.addPlane(new navPlane('p03', -260, -240,	 200, 240,	+20,+20,'px')); // 03
    NAV.addPlane(new navPlane('p04', -240, -160,  200, 260,	+20,+20,'px')); 	// 04
    NAV.addPlane(new navPlane('p05', -160,  -80,  200, 260,	+20,+40,'px')); 	// 05
    NAV.addPlane(new navPlane('p06',  -80, -20,   200, 260,	+40,+60,'px')); 	// 06
    NAV.addPlane(new navPlane('p07',  -20,  +40,  140, 260,	+60,+60,'px')); 	// 07
    NAV.addPlane(new navPlane('p08',    0,  +80,  100, 140,	+60,+60,'px')); 	// 08
    NAV.addPlane(new navPlane('p09',   20, +100,   60, 100,	+60,+60,'px')); 	// 09
    NAV.addPlane(new navPlane('p10',   40, +100,   40,  60,	+60,+60,'px')); 	// 10
    NAV.addPlane(new navPlane('p11',  100,  180,   40, 100,	+40,+60,'nx')); 	// 11
    NAV.addPlane(new navPlane('p12',  180,  240,   40,  80,	+40,+40,'px')); 	// 12
    NAV.addPlane(new navPlane('p13',  180,  240,    0,  40,	+20,+40,'py')); 	// 13
    NAV.addPlane(new navPlane('p14',  200,  260,  -80,   0,	+0,+20,'py')); 		// 14
    NAV.addPlane(new navPlane('p15',  180,  240, -160, -80,	+0,+40,'ny')); 		// 15
    NAV.addPlane(new navPlane('p16',  160,  220, -220,-160,	+40,+40,'px')); 	// 16
    NAV.addPlane(new navPlane('p17',   80,  160, -240,-180,	+40,+40,'px')); 	// 17
    NAV.addPlane(new navPlane('p18',   20,   80, -220,-180,	+40,+40,'px')); 	// 18
    NAV.addPlane(new navPlane('p19',   20,   80, -180,-140,	+40,+60,'py')); 	// 19
    NAV.addPlane(new navPlane('p20',   20,   80, -140,-100,	+60,+80,'py')); 	// 20
    NAV.addPlane(new navPlane('p21',   20,   60, -100, -40,	+80,+80,'px')); 	// 21
    NAV.addPlane(new navPlane('p22',  -80,   20, -100, -40,	+80,+80,'px')); 	// 22
    NAV.addPlane(new navPlane('p23', -140,  -80, -100, -40,	+80,+80,'px')); 	// 23
    NAV.addPlane(new navPlane('p24', -140,  -80, -140,-100,	+60,+80,'py')); 	// 24
    NAV.addPlane(new navPlane('p25', -140,  -80, -200,-140,	+40,+60,'py')); 	// 25
    NAV.addPlane(new navPlane('p26', -100,  -80, -240,-200,	+40,+40,'px')); 	// 26
    NAV.addPlane(new navPlane('p27', -220, -100, -260,-200,	+40,+40,'px')); 	// 27
    NAV.addPlane(new navPlane('p28', -240, -220, -240,-200,	+40,+40,'px')); 	// 28
    NAV.addPlane(new navPlane('p29', -240, -180, -200,-140,	+20,+40,'ny')); 	// 29
    NAV.addPlane(new navPlane('p30', -240, -180, -140, -80,	+0,+20,'ny')); 		// 30
    return NAV;
};

getPositionCamera = function() {
    return [
        [-220, -40], // P1
        [-260, 280], // P2
        [-260, 280], // P3
        [-260, 280], // P4
        [-260, 280], // P5
        [65, 285],   // P6
        [65, 245],   // P7
        [5, 225],    // P8
        [50, 90],    // P9
        [50, 90],    // P10
        [160, 50],   // P11
        [160, 50],   // P12
        [160, 50],   // P13
        [225, -20],  // P14
        [225, -20],  // P15
        [210, -165], // P16
        [210, -165], // P17
        [210, -165], // P18
        [210, -165], // P19
        [210, -165], // P20
        [210, -165], // P21
        [210, -165], // P22
        [-107, -71], // P23
        [-107, -71], // P24
        [-107, -71], // P25
        [-171, -230],// P26
        [-171, -230],// P27
        [-171, -230],// P28
        [-171, -230],// P29
        [-171, -230] // P30
    ];
};