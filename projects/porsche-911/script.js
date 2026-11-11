/* ==========================================================================
   PORSCHE 911 — THE UNBEATABLE
   Modular Vanilla JS: Data Registry, Timeline, Model Explorer,
   Engineering Inspector, Scroll Reveals & Parallax
   ========================================================================== */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Verified Historical & Factory Data Registry
     ------------------------------------------------------------------------ */
  const GENERATIONS = [
    {
      id: 'original',
      code: '901 / F',
      name: 'Original 911',
      subtitle: 'F-Model · The Founding Silhouette',
      years: '1963 – 1973',
      image: 'assets/images/gen-original.jpg',
      alt: 'Original 1964 Porsche 911 F-Model in silver metallic with classic Fuchs wheels',
      description:
        'Unveiled as the 901 at the 1963 Frankfurt IAA and renamed 911 for production in 1964, Ferdinand Alexander Porsche’s successor to the 356 established the enduring sports car template: unitary steel body, rear-mounted air-cooled flat-six, and a pure flyline that ignored fleeting fashion.',
      specs: [
        { label: 'Cooling & Layout', value: 'Air-Cooled · Rear-Engine RWD' },
        { label: 'Original Engine', value: '1,991 cc Flat-Six (130 PS / 174 Nm)' },
        { label: 'Transmission', value: '5-Speed Type 901 Dog-Leg Manual' },
        { label: 'Defining Milestone', value: 'Established the Iconic 911 Silhouette' },
      ],
    },
    {
      id: 'g-series',
      code: 'G-SERIES',
      name: 'G-Series',
      subtitle: '1973 – 1989 · Bellows Bumpers & The First Turbo',
      years: '1973 – 1989',
      image: 'assets/images/gen-g-series.jpg',
      alt: 'Porsche 911 G-Series in deep charcoal metallic with accordion impact bumpers',
      description:
        'The longest-running 911 generation introduced unmistakable accordion impact bumpers for global safety compliance—and forever altered performance history in 1975 when the Type 930 debuted exhaust-gas turbocharging on a production sports car.',
      specs: [
        { label: 'Cooling & Layout', value: 'Air-Cooled · Rear-Engine RWD' },
        { label: 'Iconic Engines', value: '3.2L Carrera (231 PS) · 3.3L Turbo (300 PS)' },
        { label: 'Transmission', value: '915 & Later Hydraulic G50 5-Speed Manual' },
        { label: 'Defining Milestone', value: '1975 Type 930 Turbocharged Benchmark' },
      ],
    },
    {
      id: '964',
      code: '964',
      name: 'Type 964',
      subtitle: '1988 – 1994 · All-Wheel Drive Evolution',
      years: '1988 – 1994',
      image: 'assets/images/gen-964.jpg',
      alt: 'Porsche 964 Carrera in metallic slate grey with flush bumpers and Cup wheels',
      description:
        'Although it preserved the classic 911 silhouette, Porsche re-engineered 85 percent of the car beneath the surface. Flush integrated bumpers, an automatically extending rear spoiler, ABS, power steering, and coil-spring suspension modernized handling while introducing standard all-wheel drive on the Carrera 4.',
      specs: [
        { label: 'Cooling & Layout', value: 'Air-Cooled · RWD (C2) & AWD (C4)' },
        { label: 'Engine Architecture', value: '3.6L M64 Twin-Spark Flat-Six (250 PS)' },
        { label: 'Chassis Breakthrough', value: 'Coil Springs & ABS Replacing Torsion Bars' },
        { label: 'Defining Milestone', value: '959-Derived All-Wheel Drive System' },
      ],
    },
    {
      id: '993',
      code: '993',
      name: 'Type 993',
      subtitle: '1993 – 1998 · Pinnacle of the Air-Cooled Era',
      years: '1993 – 1998',
      image: 'assets/images/gen-993.jpg',
      alt: 'Porsche 993 final air-cooled generation in dark metallic silver studio lighting',
      description:
        'Revered by collectors and engineers alike as the crowning achievement of the air-cooled 911 lineage. Smoothly laid-back polyellipsoid fenders framed an all-new aluminum multi-link rear axle that dramatically heightened cornering composure, paired with the first 6-speed manual gearbox and twin-turbo power on the Turbo.',
      specs: [
        { label: 'Cooling & Layout', value: 'Final Air-Cooled · RWD & AWD' },
        { label: 'Engine Evolution', value: '3.6L VarioRam (272–285 PS) · Turbo (408 PS)' },
        { label: 'Transmission', value: 'First 6-Speed Manual 911 Gearbox' },
        { label: 'Defining Milestone', value: 'Lightweight Multi-Link Rear Axle' },
      ],
    },
    {
      id: '996',
      code: '996',
      name: 'Type 996',
      subtitle: '1997 – 2005 · The Water-Cooled Reinvention',
      years: '1997 – 2005',
      image: 'assets/images/gen-996.jpg',
      alt: 'Ocean Blue Metallic Porsche 996 Carrera Cabriolet marking the first water-cooled generation',
      description:
        'To meet tightening emissions, acoustics, and power targets entering the 21st century, the 996 retired air-cooling after 34 years. Built on an entirely new platform with integrated teardrop headlamps, it birthed the naturally aspirated GT3 lineage and the race-derived Mezger flat-six.',
      specs: [
        { label: 'Cooling & Layout', value: 'First Water-Cooled 911 · RWD & AWD' },
        { label: 'Standard Engines', value: '3.4L / 3.6L VarioCam Flat-Six (300–320 PS)' },
        { label: 'Motorsport Lineage', value: 'Mezger Block in GT3 & 420 PS Turbo' },
        { label: 'Defining Milestone', value: 'Inaugural 911 GT3 Introduced in 1999' },
      ],
    },
    {
      id: '997',
      code: '997',
      name: 'Type 997',
      subtitle: '2004 – 2012 · Classic Eyes, Modern Precision',
      years: '2004 – 2012',
      image: 'assets/images/gen-997.jpg',
      alt: 'Guards Red Porsche 997 Turbo in motion displaying classic upright oval headlamps',
      description:
        'Restoring upright oval headlamps alongside taut, wider haunches, the 997 bridged heritage aesthetics and contemporary supercar speed. Its 2009 mid-cycle update ushered in Direct Fuel Injection (DFI) and replaced conventional automatics with the lightning-fast Porsche Doppelkupplung (PDK).',
      specs: [
        { label: 'Cooling & Layout', value: 'Water-Cooled · RWD & AWD' },
        { label: 'Output Spectrum', value: '325 PS Carrera up to 620 PS GT2 RS' },
        { label: 'Transmission', value: '7-Speed PDK Debut (997.2, 2009)' },
        { label: 'Defining Milestone', value: 'Direct Fuel Injection & Active PASM' },
      ],
    },
    {
      id: '991',
      code: '991',
      name: 'Type 991',
      subtitle: '2011 – 2019 · Longer Wheelbase, Twin-Turbo Shift',
      years: '2011 – 2019',
      image: 'assets/images/gen-991.jpg',
      alt: 'Sapphire Blue Porsche 991.2 GT3 Touring under dramatic exhibition lighting',
      description:
        'A ground-up aluminum-steel composite chassis extended the wheelbase by 100 mm while shedding weight and elevating high-speed stability. In 2016, the 991.2 update brought 3.0-liter twin-turbocharged engines to standard Carrera models—while the 991.2 GT2 RS delivered 700 PS.',
      specs: [
        { label: 'Body Construction', value: 'Aluminum-Steel Composite Lightweight Shell' },
        { label: 'Carrera Engines', value: '3.4/3.8L NA (991.1) → 3.0L Twin-Turbo (991.2)' },
        { label: 'Transmission', value: '7-Speed Manual & 7-Speed PDK' },
        { label: 'Defining Milestone', value: '700 PS 991.2 GT2 RS Benchmark' },
      ],
    },
    {
      id: '992',
      code: '992',
      name: 'Type 992',
      subtitle: '2018 – Present · Wide Body & T-Hybrid Era',
      years: '2018 – Present',
      image: 'assets/images/gen-992.jpg',
      alt: 'GT Silver Porsche 992 Carrera 4S rear angle showcasing wide bodywork and continuous LED light bar',
      description:
        'Standardizing wide rear bodywork across every variant, the 992 pairs staggered 20/21-inch wheels, recessed door handles, and a continuous rear light bar with cutting-edge active aerodynamics. With the 992.2 refresh, Porsche introduced the lightweight T-Hybrid system on the Carrera GTS and 711 PS Turbo S.',
      specs: [
        { label: 'Chassis & Wheels', value: 'Mixed 20" Front / 21" Rear Architecture' },
        { label: 'Transmission', value: '8-Speed PDK · 6/7-Speed Manual (Select)' },
        { label: 'Aerodynamics', value: 'Up to 860 kg Downforce on GT3 RS' },
        { label: 'Defining Milestone', value: '992.2 eTurbo T-Hybrid Architecture' },
      ],
    },
  ];

  const MODELS = [
    {
      id: 'carrera',
      name: '911 Carrera',
      category: 'carrera',
      categoryLabel: 'PURE SPORTS COUPÉ',
      era: '992.2 GENERATION',
      tagline: 'The unmistakable original formula—distilled for today.',
      description:
        'At the foundation of the lineup sits the pure rear-wheel-drive 911 Carrera. Powered by an updated 3.0-liter twin-turbocharged flat-six borrowing larger turbochargers and intercooling advances from higher-tier models, it balances everyday poise with authentic rear-engine feedback.',
      image: 'assets/images/model-carrera.jpg',
      alt: 'White Porsche 911 Carrera 992 coupe in front three-quarter profile',
      powerDisplay: '394 PS / 388 hp',
      telemetry: [
        { label: 'Power', value: '394 PS (388 hp)' },
        { label: 'Torque', value: '450 Nm (332 lb-ft)' },
        { label: '0–100 km/h', value: '4.1 s (3.9 s Chrono)' },
        { label: 'Top Speed', value: '294 km/h (183 mph)' },
        { label: 'Engine', value: '3.0L Twin-Turbo Flat-6' },
        { label: 'Drivetrain', value: '8-Speed PDK · RWD' },
      ],
      signature: '2,981 cc twin-turbo flat-six peaking at 6,500 rpm with PASM adaptive dampers and staggered 19/20" or 20/21" wheels.',
    },
    {
      id: 'carrera-gts',
      name: '911 Carrera GTS',
      category: 'carrera',
      categoryLabel: 'PERFORMANCE T-HYBRID',
      era: '992.2 T-HYBRID',
      tagline: 'Zero turbo lag. The first street-legal hybrid 911.',
      description:
        'A watershed moment in Zuffenhausen history: the 992.2 Carrera GTS debuts Porsche’s lightweight T-Hybrid drivetrain. A newly developed 3.6-liter boxer engine works alongside an electric exhaust gas turbocharger (eTurbo) and a PDK-integrated electric motor fed by a compact 1.9 kWh 400V battery.',
      image: 'assets/images/model-carrera-gts.jpg',
      alt: 'Slate Grey Neo Porsche 992.2 911 Carrera GTS featuring vertical active cooling louvers and center-lock wheels',
      powerDisplay: '541 PS / 532 hp',
      telemetry: [
        { label: 'System Power', value: '541 PS (532 hp)' },
        { label: 'System Torque', value: '610 Nm (449 lb-ft)' },
        { label: '0–100 km/h', value: '3.0 seconds' },
        { label: 'Top Speed', value: '312 km/h (194 mph)' },
        { label: 'Engine', value: '3.6L eTurbo T-Hybrid' },
        { label: 'Drivetrain', value: '8-Speed PDK · RWD / AWD' },
      ],
      signature: 'Electric motor inside the turbocharger builds instant boost without a wastegate while recuperating up to 11 kW from exhaust flow.',
    },
    {
      id: 'cabriolet',
      name: '911 Cabriolet',
      category: 'carrera',
      categoryLabel: 'OPEN-AIR GRAND TOURER',
      era: '992.2 GENERATION',
      tagline: 'Unfiltered flat-six acoustics beneath an open sky.',
      description:
        'Engineered from day one alongside the coupé so structural rigidity and flyline silhouette remain intact. Its tensioned fabric soft-top incorporates integral magnesium surface elements to resist ballooning at autobahn speeds and retracts cleanly in seconds.',
      image: 'assets/images/model-cabriolet.jpg',
      alt: 'Ice Grey Metallic Porsche 992.2 911 Carrera Cabriolet under showroom lighting with its black acoustic soft-top raised',
      powerDisplay: '394–541 PS',
      telemetry: [
        { label: 'Power (Carrera)', value: '394 PS (388 hp)' },
        { label: 'Torque (Carrera)', value: '450 Nm (332 lb-ft)' },
        { label: 'Roof Cycle', value: '12 seconds (≤ 50 km/h)' },
        { label: 'Engine Range', value: '3.0L TT / 3.6L T-Hybrid' },
        { label: 'Transmission', value: '8-Speed PDK' },
        { label: 'Drivetrain', value: 'RWD or Active AWD' },
      ],
      signature: 'Fully automatic fabric roof opens or closes in 12 seconds at speeds up to 50 km/h (31 mph) while preserving the iconic 911 roofline.',
    },
    {
      id: 'targa',
      name: '911 Targa',
      category: 'carrera',
      categoryLabel: 'ARCHITECTURAL ICON',
      era: '992.2 TARGA 4 GTS',
      tagline: 'Born in 1965. Defined by its wraparound roll bar.',
      description:
        'Combining coupé composure with open-air theater, the modern 911 Targa pays direct tribute to the 1965 original with its wide metallic roll hoop and wraparound rear glass dome. Today offered with standard all-wheel drive and the 541 PS T-Hybrid system on the Targa 4 GTS.',
      image: 'assets/images/model-targa.jpg',
      alt: 'Guards Red Porsche 911 Targa 4 GTS beneath the Stuttgart crest highlighting its wraparound Targa roll bar',
      powerDisplay: '541 PS / 532 hp',
      telemetry: [
        { label: 'System Power', value: '541 PS (532 hp)' },
        { label: 'System Torque', value: '610 Nm (449 lb-ft)' },
        { label: 'Roof Cycle', value: '19 seconds (Automated)' },
        { label: 'Engine', value: '3.6L eTurbo T-Hybrid' },
        { label: 'Transmission', value: '8-Speed PDK' },
        { label: 'Drivetrain', value: 'Standard PTM AWD' },
      ],
      signature: 'Choreographed 19-second automated roof mechanism raises the entire wraparound rear glass canopy to stow the center panel cleanly behind the seats.',
    },
    {
      id: 'turbo',
      name: '911 Turbo',
      category: 'turbo',
      categoryLabel: 'ALL-WEATHER SUPERCAR',
      era: '992.1 GENERATION',
      tagline: 'Effortless velocity forged for every surface and season.',
      description:
        'Nearly fifty years after the 930 shocked the sports car world, the 911 Turbo unites wide-body stance, rear-quarter side air intakes, adaptive Porsche Active Aerodynamics, and active all-wheel drive—delivering supercar pace with grand-touring composure.',
      image: 'assets/images/model-turbo.jpg',
      alt: 'Obsidian black Porsche 911 Turbo (992) rear three-quarter angle showing wide intakes and active wing',
      powerDisplay: '580 PS / 572 hp',
      telemetry: [
        { label: 'Power', value: '580 PS (572 hp)' },
        { label: 'Torque', value: '750 Nm (553 lb-ft)' },
        { label: '0–100 km/h', value: '2.8 seconds' },
        { label: 'Top Speed', value: '320 km/h (199 mph)' },
        { label: 'Engine', value: '3.7L Twin-Turbo Flat-6' },
        { label: 'Drivetrain', value: '8-Speed PDK · AWD' },
      ],
      signature: '3,745 cc twin-turbocharged boxer featuring symmetrical Variable Turbine Geometry (VTG) chargers and multi-stage active front and rear aero.',
    },
    {
      id: 'turbo-s',
      name: '911 Turbo S',
      category: 'turbo',
      categoryLabel: 'APEX T-HYBRID SUPERCAR',
      era: '992.2 T-HYBRID',
      tagline: '711 PS twin-eTurbo authority across every mile.',
      description:
        'The most powerful series-production 911 ever engineered. For the 992.2 generation, the flagship 911 Turbo S pairs a 3.6-liter flat-six with dual electric exhaust gas turbochargers (eTurbos) and a PDK-integrated electric motor—delivering 711 PS and 800 Nm across all four wheels.',
      image: 'assets/images/model-turbo-s.jpg',
      alt: 'Metallic slate Porsche 992.2 911 Turbo S Coupe on an exhibition stage displaying active vertical intake louvers and rear wing',
      powerDisplay: '711 PS / 701 hp',
      telemetry: [
        { label: 'System Power', value: '711 PS (701 hp)' },
        { label: 'System Torque', value: '800 Nm (590 lb-ft)' },
        { label: '0–100 km/h', value: '2.5 seconds (Chrono)' },
        { label: 'Top Speed', value: '322 km/h (200 mph)' },
        { label: 'Engine', value: '3.6L Dual-eTurbo T-Hybrid' },
        { label: 'Drivetrain', value: '8-Speed PDK · AWD' },
      ],
      signature: 'Standard Porsche Ceramic Composite Brakes (PCCB), electro-hydraulic ehPDCC active roll stabilization, and twin eTurbos harness 800 Nm seamlessly.',
    },
    {
      id: 'gt3',
      name: '911 GT3',
      category: 'gt',
      categoryLabel: 'PURIST TRACK ICON',
      era: '992.2 GENERATION',
      tagline: '9,000 rpm naturally aspirated purity.',
      description:
        'Developed directly in Weissach alongside Porsche Motorsport’s Cup racers, the 911 GT3 rejects forced induction in favor of a razor-sharp 4.0-liter naturally aspirated flat-six with individual throttle bodies—offered with a high-downforce swan-neck wing or understated Touring package and either a 6-speed GT Sport manual or 7-speed PDK.',
      image: 'assets/images/model-gt3.jpg',
      alt: 'Dark metallic Porsche 911 GT3 Touring Bergsport (992.2) under showroom lighting with hood nostrils and center-lock wheels',
      powerDisplay: '510 PS / 502 hp',
      telemetry: [
        { label: 'Power', value: '510 PS (502 hp)' },
        { label: 'Torque', value: '450 Nm (332 lb-ft)' },
        { label: 'Redline', value: '9,000 rpm' },
        { label: 'Top Speed', value: '311 km/h (PDK) · 313 MT' },
        { label: 'Engine', value: '4.0L NA Flat-Six' },
        { label: 'Drivetrain', value: '6-Spd Manual / 7-Spd PDK · RWD' },
      ],
      signature: 'Motorsport-derived double-wishbone front suspension paired with an aerodynamic underbody diffuser and either top-mounted swan-neck wing or Touring aero.',
    },
    {
      id: 'gt3-rs',
      name: '911 GT3 RS',
      category: 'gt',
      categoryLabel: 'AERODYNAMIC WEAPON',
      era: '992.1 GENERATION',
      tagline: '860 kilograms of active downforce. Road-legal motorsport.',
      description:
        'Built unapologetically for lap times, the 992 GT3 RS replaces the front luggage compartment with a single massive angled radiator, freeing space for active front wing elements and a towering hydraulic swan-neck rear wing equipped with Porsche’s first production Drag Reduction System (DRS).',
      image: 'assets/images/model-gt3-rs.jpg',
      alt: 'White and Viper Green Porsche 911 GT3 RS displaying swan-neck DRS rear wing and fender louvers',
      powerDisplay: '525 PS / 518 hp',
      telemetry: [
        { label: 'Power', value: '525 PS (518 hp)' },
        { label: 'Torque', value: '465 Nm (343 lb-ft)' },
        { label: '0–100 km/h', value: '3.2 seconds' },
        { label: 'Max Downforce', value: '860 kg @ 285 km/h' },
        { label: 'Engine', value: '4.0L High-Rev NA Flat-6' },
        { label: 'Drivetrain', value: '7-Speed Short PDK · RWD' },
      ],
      signature: 'Active DRS front and rear wings generate 409 kg at 200 km/h and 860 kg at 285 km/h—paired with steering-wheel-adjustable damper dials.',
    },
    {
      id: 'gt2-rs',
      name: '911 GT2 RS',
      category: 'gt',
      categoryLabel: 'FORCED-INDUCTION APEX',
      era: '991.2 FLAGSHIP',
      tagline: '700 PS sent exclusively to the rear wheels.',
      description:
        'The most extreme rear-wheel-drive production 911 ever built in the 991.2 era. Combining a twin-turbocharged 3.8-liter flat-six with water-spray intercooling, Weissach carbon-fiber weight savings, and titanium exhaust acoustics, the GT2 RS remains a monument to raw mechanical velocity.',
      image: 'assets/images/model-gt2-rs.jpg',
      alt: 'Silver and carbon-fiber Porsche 911 GT2 RS Weissach (991.2) on dark exhibition flooring with magnesium wheels',
      powerDisplay: '700 PS / 690 hp',
      telemetry: [
        { label: 'Power', value: '700 PS (690 hp)' },
        { label: 'Torque', value: '750 Nm (553 lb-ft)' },
        { label: '0–100 km/h', value: '2.8 s (2.7 s 0–60 mph)' },
        { label: 'Top Speed', value: '340 km/h (211 mph)' },
        { label: 'Engine', value: '3.8L Twin-Turbo + Water Spray' },
        { label: 'Drivetrain', value: '7-Speed PDK · RWD' },
      ],
      signature: 'Water-spray charge-air cooling lowers intake temperatures under full boost, paired with NACA hood ducts and magnesium Weissach wheels.',
    },
  ];

  const ENGINEERING = [
    {
      id: 'flat-six',
      code: '01 / POWERTRAIN',
      title: 'Flat-Six Engine Heritage',
      lead:
        'Since 1963, the horizontally opposed six-cylinder boxer engine has defined the acoustic signature and low center of gravity of every 911. Opposing pistons cancel primary and secondary inertia forces naturally, allowing the powertrain to sit low and tight beneath the rear deck.',
      distinctions: [
        {
          model: 'Carrera & Cabriolet',
          spec: '3.0L (2,981 cc) twin-turbocharged flat-six delivering 394 PS (388 hp) and 450 Nm with broad mid-range responsiveness.',
        },
        {
          model: 'Carrera GTS & Targa 4 GTS',
          spec: 'All-new 3.6L flat-six engineered specifically for T-Hybrid single electric turbocharging (541 PS combined).',
        },
        {
          model: 'Turbo & 992.2 Turbo S',
          spec: '3.7L (3,745 cc) twin-turbo VTG boxer on the 911 Turbo (580 PS), crowned by the 711 PS 3.6L dual-eTurbo T-Hybrid Turbo S.',
        },
        {
          model: 'GT3, GT3 RS & 991.2 GT2 RS',
          spec: 'Motorsport 4.0L naturally aspirated flat-six spinning to 9,000 rpm (GT3/RS) vs. 700 PS 3.8L water-spray twin-turbo (GT2 RS).',
        },
      ],
    },
    {
      id: 'rear-engine',
      code: '02 / ARCHITECTURE',
      title: 'Rear-Engine Architecture',
      lead:
        'Placing the engine behind the rear axle seems counterintuitive on paper—yet sixty years of refinement have converted that mass distribution into an unmistakable dynamic edge. Weight over the rear tires maximizes launch grip, corner-exit traction, and braking balance while keeping the nose astonishingly communicative.',
      distinctions: [
        {
          model: 'Pure Rear-Wheel Drive',
          spec: 'Carrera, Carrera GTS (RWD), GT3, GT3 RS, and GT2 RS preserve classic front-to-rear steering purity with mechanical or electronically controlled rear differentials.',
        },
        {
          model: 'Active All-Wheel Drive (PTM)',
          spec: 'Targa 4 GTS, Turbo, Turbo S, and Carrera 4 models continuously meter front-axle torque via a water-cooled multi-plate clutch.',
        },
        {
          model: 'Compact Packaging',
          spec: 'Low-mounted boxer cylinders permit a short rear overhang and an unbroken sloping cabin flyline impossible with inline or V-engines.',
        },
        {
          model: 'Braking Stability',
          spec: 'Dynamic weight transfer under hard braking loads all four contact patches evenly rather than overwhelming the front tires.',
        },
      ],
    },
    {
      id: 'pdk',
      code: '03 / TRANSMISSION',
      title: 'Porsche Doppelkupplung (PDK)',
      lead:
        'Debuted on production 911s in the 997.2 era after winning endurance circuits in the 1980s, Porsche’s dual-clutch PDK pairs two separate half-gearboxes on coaxial shafts. While one clutch transmits power, the next ratio is already pre-engaged for millisecond shifts without torque interruption.',
      distinctions: [
        {
          model: '8-Speed Touring & Turbo PDK',
          spec: 'Standard across Carrera, Cabriolet, Targa, and Turbo—combining ferocious launch control with tall overdrive cruising efficiency.',
        },
        {
          model: 'T-Hybrid Integrated PDK',
          spec: 'Strengthened 8-speed PDK on 992.2 Carrera GTS and Turbo S models houses a permanent-magnet synchronous motor for instant electric boost.',
        },
        {
          model: '7-Speed Short-Ratio Sport PDK',
          spec: 'Equipped on GT3, GT3 RS, and 991.2 GT2 RS with shortened final-drive ratios and crisp motorsport paddle programming.',
        },
        {
          model: '6-Speed GT Sport Manual',
          spec: 'Available exclusively on the 911 GT3 for purists seeking tactile mechanical engagement paired with 9,000 rpm shifts.',
        },
      ],
    },
    {
      id: 'aerodynamics',
      code: '04 / AERODYNAMICS',
      title: 'Active Aerodynamics',
      lead:
        'Preserving a six-decade silhouette requires aerodynamic intelligence hidden inside the bodywork. From active radiator cooling flaps and deployable rear spoilers to full Formula 1–derived drag reduction, every millimeter manages lift, cooling, and high-speed stability.',
      distinctions: [
        {
          model: 'Carrera, Cabriolet & GTS',
          spec: 'Flush active cooling air flaps behind the front intakes open strictly on demand alongside an adaptive speed-dependent rear spoiler.',
        },
        {
          model: 'Turbo & Turbo S (PAA)',
          spec: 'Porsche Active Aerodynamics deploys a pneumatic three-stage front lip and tilting rear wing across Speed, Performance, and Wet modes.',
        },
        {
          model: '911 GT3',
          spec: 'Top-mounted swan-neck rear wing leaves the high-suction underside uninterrupted, working with an expansive rear diffuser.',
        },
        {
          model: '911 GT3 RS (DRS)',
          spec: 'First production Porsche with Drag Reduction System: active front and hydraulic dual-plane rear wings produce 860 kg of downforce at 285 km/h.',
        },
      ],
    },
    {
      id: 'hybrid',
      code: '05 / ELECTRIFICATION',
      title: 'T-Hybrid Technology',
      lead:
        'Engineered explicitly for motorsport responsiveness rather than heavy plug-in electric range, the 992.2 T-Hybrid architecture uses lightweight high-voltage electrification to erase turbo lag and heighten low-end torque while keeping overall weight penalty minimal.',
      distinctions: [
        {
          model: 'Carrera GTS & 992.2 Turbo S',
          spec: 'Debuted at 541 PS on the Carrera GTS and Targa 4 GTS, then scaled to 711 PS with dual eTurbos on the flagship 992.2 Turbo S.',
        },
        {
          model: 'Electric Exhaust Turbocharger',
          spec: 'Motors integrated directly onto the turbo shaft spool boost instantaneously and harvest electrical energy from exhaust gas flow.',
        },
        {
          model: 'PDK-Integrated E-Motor',
          spec: 'A compact permanent-magnet motor inside the 8-speed PDK housing assists acceleration from idle and handles brake recuperation.',
        },
        {
          model: '1.9 kWh / 400V Battery',
          spec: 'Positioned under the front hood in the physical footprint of a conventional 12V starter battery to preserve 911 weight balance.',
        },
      ],
    },
    {
      id: 'chassis',
      code: '06 / CHASSIS',
      title: 'Chassis & Suspension Engineering',
      lead:
        'Staggered 20-inch front and 21-inch rear wheel-and-tire packaging works in concert with lightweight aluminum-steel body rigidity to deliver sharp turn-in and unshakeable rear stability—tuned uniquely for road touring or apex-hunting track duty.',
      distinctions: [
        {
          model: 'Carrera, Cabriolet & Targa',
          spec: 'MacPherson front struts and multi-link rear axle with PASM adaptive damping and available rear-axle steering.',
        },
        {
          model: '992.2 Turbo S',
          spec: 'Standard electro-hydraulic ehPDCC active roll stabilization, rear-axle steering, and PCCB ceramic composite brakes.',
        },
        {
          model: 'GT3 & GT3 RS Front Axle',
          spec: 'Motorsport-derived double-wishbone front suspension eliminates camber loss under lateral G-loads—with teardrop aero links on the GT3 RS.',
        },
        {
          model: 'GT3 RS Track Tuning',
          spec: 'Four steering-wheel rotary dials allow live independent adjustment of rebound/compression damping, differential lock, and traction control.',
        },
      ],
    },
  ];

  /* ------------------------------------------------------------------------
     1. Hero Entrance & Header Scroll State
     ------------------------------------------------------------------------ */
  const initHeroEntrance = () => {
    const activate = () => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('hero-ready');
    };

    if (prefersReducedMotion) {
      activate();
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(activate);
    });
  };

  const initHeader = () => {
    const header = document.getElementById('site-header');
    if (!header) return;

    const updateHeader = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 36);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  };

  /* ------------------------------------------------------------------------
     2. Responsive Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const initMobileNav = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    if (!toggle || !drawer) return;

    const links = drawer.querySelectorAll('a');
    let isOpen = false;

    const setDrawerState = (open) => {
      isOpen = open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');

      const labelEl = toggle.querySelector('.menu-label');
      if (labelEl) labelEl.textContent = open ? 'CLOSE' : 'MENU';

      if (open) {
        drawer.hidden = false;
        requestAnimationFrame(() => {
          drawer.classList.add('is-open');
          drawer.setAttribute('aria-hidden', 'false');
        });
        document.body.classList.add('nav-open');
      } else {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
        setTimeout(() => {
          if (!isOpen) drawer.hidden = true;
        }, 420);
      }
    };

    toggle.addEventListener('click', () => setDrawerState(!isOpen));

    links.forEach((link) => {
      link.addEventListener('click', () => {
        if (isOpen) setDrawerState(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen) {
        setDrawerState(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && isOpen) {
        setDrawerState(false);
      }
    });
  };

  /* ------------------------------------------------------------------------
     3. Interactive Generations Timeline
     ------------------------------------------------------------------------ */
  const initGenerationsTimeline = () => {
    const tablist = document.getElementById('generations-tablist');
    const progressEl = document.getElementById('timeline-progress');
    const watermarkEl = document.getElementById('gen-watermark');
    const imageEl = document.getElementById('gen-image');
    const counterEl = document.getElementById('gen-counter');
    const periodEl = document.getElementById('gen-period');
    const titleEl = document.getElementById('gen-title');
    const subtitleEl = document.getElementById('gen-subtitle');
    const descEl = document.getElementById('gen-description');
    const specsEl = document.getElementById('gen-specs');
    const prevBtn = document.getElementById('gen-prev');
    const nextBtn = document.getElementById('gen-next');

    if (!tablist || !imageEl || !specsEl) return;

    let activeIndex = 0;

    // Build timeline tabs
    const tabs = GENERATIONS.map((gen, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'timeline-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      btn.setAttribute('id', `gen-tab-${gen.id}`);
      btn.innerHTML = `
        <span class="tab-era-num">${String(index + 1).padStart(2, '0')}</span>
        <span class="tab-era-name">${gen.code === '901 / F' ? 'Original 911' : gen.code}</span>
        <span class="tab-era-years">${gen.years}</span>
      `;
      btn.addEventListener('click', () => selectGeneration(index));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = (index + 1) % GENERATIONS.length;
          selectGeneration(next, true);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = (index - 1 + GENERATIONS.length) % GENERATIONS.length;
          selectGeneration(prev, true);
        }
      });
      tablist.appendChild(btn);
      return btn;
    });

    const renderDossier = (gen, index) => {
      counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(GENERATIONS.length).padStart(2, '0')}`;
      periodEl.textContent = gen.years;
      titleEl.textContent = gen.name;
      subtitleEl.textContent = gen.subtitle;
      descEl.textContent = gen.description;
      if (watermarkEl) watermarkEl.textContent = gen.code === '901 / F' ? '901' : gen.code;

      specsEl.innerHTML = gen.specs
        .map(
          (spec) => `
            <div class="spec-pair">
              <dt>${spec.label}</dt>
              <dd>${spec.value}</dd>
            </div>
          `
        )
        .join('');
    };

    const selectGeneration = (index, focusTab = false) => {
      activeIndex = index;
      const gen = GENERATIONS[index];

      tabs.forEach((tab, idx) => {
        const active = idx === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      if (focusTab) tabs[index].focus();

      if (progressEl) {
        const pct = ((index + 1) / GENERATIONS.length) * 100;
        progressEl.style.width = `${pct}%`;
      }

      if (imageEl.getAttribute('src') !== gen.image) {
        imageEl.classList.add('is-switching');
        const nextImg = new Image();
        nextImg.decoding = 'async';
        nextImg.onload = () => {
          if (activeIndex !== index) return;
          imageEl.src = gen.image;
          imageEl.alt = gen.alt;
          imageEl.classList.remove('is-switching');
        };
        nextImg.onerror = () => {
          if (activeIndex !== index) return;
          imageEl.src = gen.image;
          imageEl.alt = gen.alt;
          imageEl.classList.remove('is-switching');
        };
        nextImg.src = gen.image;
      } else {
        imageEl.alt = gen.alt;
        imageEl.classList.remove('is-switching');
      }

      renderDossier(gen, index);

      // Keep active tab visible on narrow horizontal scroll strips
      if (window.innerWidth <= 680) {
        tabs[index].scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const prev = (activeIndex - 1 + GENERATIONS.length) % GENERATIONS.length;
        selectGeneration(prev);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const next = (activeIndex + 1) % GENERATIONS.length;
        selectGeneration(next);
      });
    }

    selectGeneration(0);
  };

  /* ------------------------------------------------------------------------
     4. Interactive Models Explorer & Category Filter
     ------------------------------------------------------------------------ */
  const initModelsExplorer = () => {
    const galleryEl = document.getElementById('models-gallery');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const spotlightImg = document.getElementById('spotlight-image');
    const spotlightEra = document.getElementById('spotlight-era');
    const spotlightCategory = document.getElementById('spotlight-category');
    const spotlightTitle = document.getElementById('spotlight-title');
    const spotlightTagline = document.getElementById('spotlight-tagline');
    const spotlightDesc = document.getElementById('spotlight-description');
    const spotlightTelemetry = document.getElementById('spotlight-telemetry');
    const spotlightSig = document.getElementById('spotlight-signature');
    const spotlightEl = document.getElementById('model-spotlight');

    if (!galleryEl || !spotlightImg || !spotlightTelemetry) return;

    let selectedId = MODELS[0].id;
    const tileMap = new Map();

    const updateSpotlight = (model, scrollIntoFocus = false) => {
      selectedId = model.id;

      tileMap.forEach((tile, id) => {
        const isCurrent = id === selectedId;
        tile.classList.toggle('is-selected', isCurrent);
        tile.setAttribute('aria-pressed', String(isCurrent));
      });

      spotlightEra.textContent = model.era;
      spotlightCategory.textContent = model.categoryLabel;
      spotlightTitle.textContent = model.name;
      spotlightTagline.textContent = model.tagline;
      spotlightDesc.textContent = model.description;
      spotlightSig.textContent = model.signature;

      spotlightTelemetry.innerHTML = model.telemetry
        .map(
          (item) => `
            <div class="telemetry-cell">
              <dt>${item.label}</dt>
              <dd>${item.value}</dd>
            </div>
          `
        )
        .join('');

      if (spotlightImg.getAttribute('src') !== model.image) {
        spotlightImg.classList.add('is-switching');
        const loader = new Image();
        loader.decoding = 'async';
        loader.onload = () => {
          if (selectedId !== model.id) return;
          spotlightImg.src = model.image;
          spotlightImg.alt = model.alt;
          spotlightImg.classList.remove('is-switching');
        };
        loader.onerror = () => {
          if (selectedId !== model.id) return;
          spotlightImg.src = model.image;
          spotlightImg.alt = model.alt;
          spotlightImg.classList.remove('is-switching');
        };
        loader.src = model.image;
      } else {
        spotlightImg.alt = model.alt;
        spotlightImg.classList.remove('is-switching');
      }

      if (scrollIntoFocus && spotlightEl) {
        spotlightEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'nearest',
        });
      }
    };

    // Build all 9 image-led model tiles
    MODELS.forEach((model) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'model-tile';
      tile.setAttribute('role', 'listitem');
      tile.setAttribute('data-model-id', model.id);
      tile.setAttribute('data-category', model.category);
      tile.setAttribute('aria-pressed', model.id === selectedId ? 'true' : 'false');
      tile.innerHTML = `
        <div class="model-tile-media">
          <img src="${model.image}" alt="${model.alt}" width="1280" height="800" loading="lazy" decoding="async">
        </div>
        <div class="model-tile-body">
          <div>
            <p class="model-tile-kicker">${model.categoryLabel}</p>
            <h3 class="model-tile-name">${model.name}</h3>
          </div>
          <div class="model-tile-output">
            <span class="model-tile-ps">${model.powerDisplay}</span>
            <span class="model-tile-arrow" aria-hidden="true">EXPLORE →</span>
          </div>
        </div>
      `;

      tile.addEventListener('click', () => updateSpotlight(model, true));
      galleryEl.appendChild(tile);
      tileMap.set(model.id, tile);
    });

    // Category filtering
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        filterButtons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        let firstVisibleModel = null;
        let selectedStillVisible = false;

        MODELS.forEach((model) => {
          const tile = tileMap.get(model.id);
          const show = filter === 'all' || model.category === filter;
          tile.classList.toggle('is-hidden', !show);
          if (show) {
            if (!firstVisibleModel) firstVisibleModel = model;
            if (model.id === selectedId) selectedStillVisible = true;
          }
        });

        if (!selectedStillVisible && firstVisibleModel) {
          updateSpotlight(firstVisibleModel, false);
        }
      });
    });

    // Footer model quick-jump links
    document.querySelectorAll('[data-jump-model]').forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = link.getAttribute('data-jump-model');
        const targetModel = MODELS.find((m) => m.id === targetId);
        if (!targetModel) return;

        // Reset filter to All if hidden
        const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilterBtn) allFilterBtn.click();
        updateSpotlight(targetModel, false);
      });
    });

    updateSpotlight(MODELS[0], false);
  };

  /* ------------------------------------------------------------------------
     5. Interactive Engineering Discipline Inspector
     ------------------------------------------------------------------------ */
  const initEngineeringExplorer = () => {
    const pillarsEl = document.getElementById('engineering-pillars');
    const codeEl = document.getElementById('eng-code');
    const titleEl = document.getElementById('eng-title');
    const leadEl = document.getElementById('eng-lead');
    const distinctionsEl = document.getElementById('eng-distinctions');

    if (!pillarsEl || !codeEl || !distinctionsEl) return;

    const tabs = ENGINEERING.map((item, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'eng-pillar-tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      btn.innerHTML = `
        <div>
          <span class="eng-pillar-code">${item.code}</span>
          <span class="eng-pillar-title">${item.title}</span>
        </div>
        <span class="eng-pillar-indicator" aria-hidden="true">→</span>
      `;
      btn.addEventListener('click', () => selectPillar(idx));
      pillarsEl.appendChild(btn);
      return btn;
    });

    const selectPillar = (index) => {
      const item = ENGINEERING[index];
      tabs.forEach((tab, idx) => {
        const active = idx === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });

      codeEl.textContent = item.code;
      titleEl.textContent = item.title;
      leadEl.textContent = item.lead;
      distinctionsEl.innerHTML = item.distinctions
        .map(
          (d) => `
            <div class="distinction-card">
              <h5 class="distinction-model">${d.model}</h5>
              <p class="distinction-spec">${d.spec}</p>
            </div>
          `
        )
        .join('');
    };

    selectPillar(0);
  };

  /* ------------------------------------------------------------------------
     6. Smooth Anchor Scrolling & ScrollSpy Active Nav
     ------------------------------------------------------------------------ */
  const initSmoothScrolling = () => {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        event.preventDefault();
        targetEl.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  };

  const initScrollSpy = () => {
    const navLinks = document.querySelectorAll('.nav-link[data-nav-section]');
    const sections = ['legacy', 'models', 'engineering']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('is-active', link.getAttribute('data-nav-section') === id);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -45% 0px' }
    );

    sections.forEach((sec) => observer.observe(sec));
  };

  /* ------------------------------------------------------------------------
     7. Scroll-Triggered Reveals & Gentle Parallax
     ------------------------------------------------------------------------ */
  const initScrollReveals = () => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
  };

  const initParallax = () => {
    if (prefersReducedMotion) return;

    const hero = document.getElementById('hero');
    const heroPicture = document.querySelector('[data-parallax="hero"]');
    const softImages = document.querySelectorAll('[data-parallax="soft"], [data-parallax="experience"]');

    let ticking = false;

    const updateParallax = () => {
      ticking = false;
      const mobile = window.innerWidth <= 900;

      if (hero && heroPicture) {
        if (mobile) {
          heroPicture.style.transform = '';
        } else {
          const rect = hero.getBoundingClientRect();
          if (rect.bottom >= 0) {
            const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
            const y = progress * 44;
            const scale = 1 + progress * 0.035;
            heroPicture.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          }
        }
      }

      softImages.forEach((img) => {
        if (mobile) {
          img.style.transform = '';
          return;
        }
        const container = img.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight || 900;
        if (rect.bottom < 0 || rect.top > vh) return;

        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
        const shift = Math.max(Math.min(centerOffset * -24, 24), -24);
        img.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );
  };

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance();
    initHeader();
    initMobileNav();
    initGenerationsTimeline();
    initModelsExplorer();
    initEngineeringExplorer();
    initSmoothScrolling();
    initScrollSpy();
    initScrollReveals();
    initParallax();
  });
})();
