toilet-monitoring/
├── apply-json-fixes
├── apply-json-fixes.sh
├── cleanup-old-assessment.sh
├── dist
│   └── scripts
│       ├── infrastructure
│       │   └── database
│       │       └── repositories
│       ├── lib
│       │   └── constants
│       └── scripts
├── final-type-fix.sh
├── fix-errors.sh
├── fix-null-checks.txt
├── get-docker.sh
├── INSPECTION.SETUP.md
├── LICENSE
├── manual-fixes-needed.txt
├── middleware.ts
├── next.config.js
├── next.config.mjs
├── next-env.d.ts
├── node_modules
│   ├── autoprefixer -> .pnpm/autoprefixer@10.4.21_postcss@8.5.6/node_modules/autoprefixer
│   ├── @babel
│   │   └── runtime -> ../.pnpm/@babel+runtime@7.28.4/node_modules/@babel/runtime
│   ├── cloudinary -> .pnpm/cloudinary@2.7.0/node_modules/cloudinary
│   ├── create-next-app -> .pnpm/create-next-app@15.5.6/node_modules/create-next-app
│   ├── dotenv -> .pnpm/dotenv@17.2.3/node_modules/dotenv
│   ├── eslint -> .pnpm/eslint@8.57.1/node_modules/eslint
│   ├── eslint-config-next -> .pnpm/eslint-config-next@14.2.33_eslint@8.57.1_typescript@5.9.3/node_modules/eslint-config-next
│   ├── html5-qrcode -> .pnpm/html5-qrcode@2.3.8/node_modules/html5-qrcode
│   ├── jsqr -> .pnpm/jsqr@1.4.0/node_modules/jsqr
│   ├── lucide-react -> .pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react
│   ├── @next
│   │   └── bundle-analyzer -> ../.pnpm/@next+bundle-analyzer@15.5.6/node_modules/@next/bundle-analyzer
│   ├── next -> .pnpm/next@15.5.6_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next
│   ├── node -> .pnpm/node@25.0.0/node_modules/node
│   ├── postcss -> .pnpm/postcss@8.5.6/node_modules/postcss
│   ├── prettier -> .pnpm/prettier@3.6.2/node_modules/prettier
│   ├── qrcode.react -> .pnpm/qrcode.react@4.2.0_react@19.2.0/node_modules/qrcode.react
│   ├── react -> .pnpm/react@19.2.0/node_modules/react
│   ├── react-dom -> .pnpm/react-dom@19.2.0_react@19.2.0/node_modules/react-dom
│   ├── react-qr-scanner -> .pnpm/react-qr-scanner@1.0.0-alpha.11_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/react-qr-scanner
│   ├── @supabase
│   │   ├── auth-helpers-nextjs -> ../.pnpm/@supabase+auth-helpers-nextjs@0.8.7_@supabase+supabase-js@2.75.1/node_modules/@supabase/auth-helpers-nextjs
│   │   └── supabase-js -> ../.pnpm/@supabase+supabase-js@2.75.1/node_modules/@supabase/supabase-js
│   ├── supabase -> .pnpm/supabase@2.51.0/node_modules/supabase
│   ├── @tailwindcss
│   │   └── postcss -> ../.pnpm/@tailwindcss+postcss@4.1.14/node_modules/@tailwindcss/postcss
│   ├── tailwindcss -> .pnpm/tailwindcss@4.1.14/node_modules/tailwindcss
│   ├── tsconfig-paths -> .pnpm/tsconfig-paths@4.2.0/node_modules/tsconfig-paths
│   ├── tsx -> .pnpm/tsx@4.20.6/node_modules/tsx
│   ├── @types
│   │   ├── node -> ../.pnpm/@types+node@20.19.22/node_modules/@types/node
│   │   ├── react -> ../.pnpm/@types+react@18.3.26/node_modules/@types/react
│   │   └── react-dom -> ../.pnpm/@types+react-dom@18.3.7_@types+react@18.3.26/node_modules/@types/react-dom
│   └── typescript -> .pnpm/typescript@5.9.3/node_modules/typescript
├── package.json
├── PERFORMANCE_FIX.md
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── icons
│   ├── next.svg
│   ├── qr-codes
│   ├── vercel.svg
│   └── window.svg
├── QUICK_START.md
├── README.md
├── RLS_FIX_guide.md
├── scripts
│   ├── fix-template.ts
│   ├── seed-inspection-template.ts
│   ├── seed.ts
│   └── setup-database.sql
├── SEED_GUIDE.md
├── setup-refactor.sh
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── check
│   │   │   │   └── template
│   │   │   │       └── routes.ts
│   │   │   ├── inspections
│   │   │   │   └── route.ts
│   │   │   ├── locations
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   ├── route.ts
│   │   │   │   └── test
│   │   │   │       └── route.ts
│   │   │   ├── photos
│   │   │   │   └── delete
│   │   │   │       └── route.ts
│   │   │   ├── seed
│   │   │   │   └── template
│   │   │   │       └── route.ts
│   │   │   ├── templates
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── upload
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   ├── history
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── inspection
│   │   │   │   ├── [locationId]
│   │   │   │   │   ├── page.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.module.css
│   │   │   │   ├── page.tsx
│   │   │   │   └── success
│   │   │   │       ├── page.module.css
│   │   │   │       └── page.tsx
│   │   │   ├── layout.module.css
│   │   │   ├── layout.tsx
│   │   │   ├── locations
│   │   │   │   ├── bulk
│   │   │   │   │   ├── bulk.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── create
│   │   │   │   │   ├── create.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]
│   │   │   │   │   └── qr
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── qr.module.css
│   │   │   │   ├── locations.module.css
│   │   │   │   ├── page.tsx
│   │   │   │   └── print-qr
│   │   │   │       ├── page.tsx
│   │   │   │       └── print-qr.module.css
│   │   │   ├── page.module.css
│   │   │   ├── page.tsx
│   │   │   ├── reports
│   │   │   │   ├── error.tsx
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   └── scan
│   │   │       ├── [code]
│   │   │       │   ├── page.tsx
│   │   │       │   └── scan.module.css
│   │   │       ├── page.module.css
│   │   │       └── page.tsx
│   │   ├── debug
│   │   │   └── template
│   │   │       └── page.tsx
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── inspection
│   │   │   ├── inspection.module.css
│   │   │   ├── page.tsx
│   │   │   └── success
│   │   │       ├── page.tsx
│   │   │       └── success.module.css
│   │   ├── landing.module.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── login
│   │   │   ├── layout.tsx
│   │   │   ├── login.module.css
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── seed
│   │   │   ├── page.tsx
│   │   │   └── seed.module.css
│   │   └── setup
│   │       ├── page.tsx
│   │       └── setup.module.css
│   ├── core
│   │   ├── dtos
│   │   │   └── CreateInspectionDTO.ts
│   │   ├── entities
│   │   │   ├── Assessment.ts
│   │   │   ├── InspectionEntity.ts
│   │   │   ├── InspectionTemplate.ts
│   │   │   ├── Inspection.ts
│   │   │   ├── Location.ts
│   │   │   └── User.ts
│   │   ├── repositories
│   │   │   ├── IAuthRepository.ts
│   │   │   ├── IInspectionRepository.ts
│   │   │   ├── ILocationRepository.ts
│   │   │   ├── IPhotoRepository.ts
│   │   │   └── IUserRepository.ts
│   │   ├── types
│   │   │   ├── assessment.types.ts
│   │   │   ├── database.types.ts
│   │   │   ├── enums.ts
│   │   │   ├── inspection.types.aligned.ts
│   │   │   ├── inspection.types.backup.ts
│   │   │   ├── inspection.types.ts
│   │   │   ├── interfaces.ts
│   │   │   ├── supabase.types.ts
│   │   │   └── user-role.enum.ts
│   │   └── use-cases
│   │       ├── BulkCreateLocations.ts
│   │       ├── CreateLocation.ts
│   │       ├── DeleteLocation.ts
│   │       ├── GetCurrentUserUseCase.ts
│   │       ├── GetLocationByCode.ts
│   │       ├── GetLocationById.ts
│   │       ├── GetLocationsByBuilding.ts
│   │       ├── GetLocationsByFloor.ts
│   │       ├── GetLocations.ts
│   │       ├── index.ts
│   │       ├── SearchLocations.ts
│   │       ├── SubscribeToLocations.ts
│   │       ├── UpdateLocation.ts
│   │       └── UploadPhoto.ts
│   ├── infrastructure
│   │   ├── auth
│   │   │   └── supabase-auth.ts
│   │   ├── database
│   │   │   ├── repositories
│   │   │   │   ├── InspectionTemplateRepository.ts
│   │   │   │   ├── SupabaseLocationRepository.ts
│   │   │   │   └── SupabaseUserRepository.ts
│   │   │   └── supabase.ts
│   │   ├── services
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── index.ts
│   │   │   ├── inspection.service.ts
│   │   │   ├── location.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── template.service.ts
│   │   └── storage
│   │       └── CloudinaryPhotoRepository.ts
│   ├── lib
│   │   ├── auto-cache.ts
│   │   ├── cloudinary.ts
│   │   ├── constants
│   │   │   ├── assessments.ts
│   │   │   ├── inspection.constants.ts
│   │   │   ├── locations.ts
│   │   │   └── roles.ts
│   │   ├── di.ts
│   │   ├── seed
│   │   │   └── seedTemplate.ts
│   │   └── utils
│   │       ├── calendar.ts
│   │       ├── cloudinary.client.ts
│   │       ├── date.ts
│   │       ├── formatting.ts
│   │       ├── geolocation.utils.ts
│   │       ├── index.ts
│   │       ├── rating.utils.ts
│   │       ├── scoring.ts
│   │       ├── type-helpers.ts
│   │       ├── validation.ts
│   │       └── validation.utils.ts
│   ├── presentation
│   │   ├── components
│   │   │   ├── features
│   │   │   │   ├── Inspection
│   │   │   │   │   ├── CommentModal.module.css
│   │   │   │   │   ├── CommentModal.tsx
│   │   │   │   │   ├── ComponentRating.module.css
│   │   │   │   │   ├── ComponentRating.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── InspectionForm.backup.tsx
│   │   │   │   │   ├── InspectionForm.module.css
│   │   │   │   │   ├── InspectionForm.tsx
│   │   │   │   │   ├── InspectionModeSelector.module.css
│   │   │   │   │   ├── InspectionModeSelector.tsx
│   │   │   │   │   ├── LocationModeSwitcher.module.css
│   │   │   │   │   ├── LocationModeSwitcher.tsx
│   │   │   │   │   ├── PhotoCapture.module.css
│   │   │   │   │   ├── PhotoCapture.tsx
│   │   │   │   │   ├── PhotoModeSwitcher.module.css
│   │   │   │   │   ├── PhotoModeSwitcher.tsx
│   │   │   │   │   ├── PhotoPreview.tsx
│   │   │   │   │   ├── QRScannerModal.module.css
│   │   │   │   │   ├── QRSCannerModal.tsx
│   │   │   │   │   ├── SeedTemplateButton.tsx
│   │   │   │   │   ├── UIModeSwitcher.module.css
│   │   │   │   │   └── UIModeSwitcher.tsx
│   │   │   │   ├── locations
│   │   │   │   │   ├── LocationCard.module.css
│   │   │   │   │   ├── LocationCard.tsx
│   │   │   │   │   ├── LocationStats.module.css
│   │   │   │   │   ├── LocationStats.tsx
│   │   │   │   │   ├── QRCodeDisplay.module.css
│   │   │   │   │   └── QRCodeDisplay.tsx
│   │   │   │   ├── LocationSelector
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── LocationSelector.module.css
│   │   │   │   │   └── LocationSelector.tsx
│   │   │   │   ├── PhotoCapture
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── PhotoCapture.module.css
│   │   │   │   │   └── PhotoCapture.tsx
│   │   │   │   ├── QRScanner
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── QRScanner.module.css
│   │   │   │   │   ├── QRScanner.tsx
│   │   │   │   │   └── QRScannerV2.tsx
│   │   │   │   ├── Reports
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── InspectionDetailModal.module.css
│   │   │   │   │   ├── InspectionDetailModal.tsx
│   │   │   │   │   ├── InspectionDetailModal.types.ts
│   │   │   │   │   ├── ReportFilters.module.css
│   │   │   │   │   ├── ReportFilters.tsx
│   │   │   │   │   ├── WeeklyReport.module.css
│   │   │   │   │   └── WeeklyReport.tsx
│   │   │   │   └── ReviewSubmit
│   │   │   │       ├── index.ts
│   │   │   │       ├── ReviewSubmit.module.css
│   │   │   │       └── ReviewSubmit.tsx
│   │   │   ├── layout
│   │   │   │   ├── BottomNav
│   │   │   │   │   ├── BottomNav.module.css
│   │   │   │   │   ├── BottomNav.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Header
│   │   │   │       ├── Header.module.css
│   │   │   │       ├── Header.tsx
│   │   │   │       └── index.ts
│   │   │   └── ui
│   │   │       ├── Button
│   │   │       │   ├── Button.module.css
│   │   │       │   ├── Button.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Card
│   │   │       │   ├── Card.module.css
│   │   │       │   ├── Card.tsx
│   │   │       │   └── index.ts
│   │   │       ├── EmptyLocationsState.tsx
│   │   │       ├── index.ts
│   │   │       ├── Input
│   │   │       │   ├── index.ts
│   │   │       │   ├── Input.module.css
│   │   │       │   └── Input.tsx
│   │   │       ├── Modal
│   │   │       │   ├── index.ts
│   │   │       │   ├── Modal.module.css
│   │   │       │   └── Modal.tsx
│   │   │       ├── Skeleton.tsx
│   │   │       └── Toast.tsx
│   │   ├── contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks
│   │   │   ├── index.tsx
│   │   │   ├── useGeolocation.ts
│   │   │   ├── useInspectionHistory.ts
│   │   │   ├── useInspection.ts
│   │   │   ├── useNotification.ts
│   │   │   ├── usePhotoUpload.ts
│   │   │   └── useTimer.ts
│   │   └── styles
│   │       └── tokens.css
│   └── types
│       ├── css-modules.d.ts
│       ├── global.d.ts
│       ├── html5-qrcode.d.ts
│       ├── index.ts
│       └── supabase.d.ts
├── STEP_BY_STEP_ADD_TEAMPLATE.md
├── supabase
│   └── config.toml
├── supabase_linux_amd64.tar.gz
├── supabase.types.ts
├── tailwind.config.js
├── test-data.sql
├── test-insert.sql
├── toilet-monitoring@1.0.0
├── tsc
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── type-check-after-json-fix.txt
├── type-check-final.txt
├── type-check-results.txt
└── vercel.json

124 directories, 259 files
dracarys@pop-os:~$ 

