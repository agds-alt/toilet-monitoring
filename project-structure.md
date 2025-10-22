dracarys@pop-os:~/toilet-monitoring$ cd ..
dracarys@pop-os:~$ tree toilet-monitoring/
toilet-monitoring/
├── backup-20251021-210524
│   ├── Inspection
│   │   ├── CommentModal.module.css
│   │   ├── CommentModal.tsx
│   │   ├── ComponentRating.module.css
│   │   ├── ComponentRating.tsx
│   │   ├── index.ts
│   │   ├── InspectionForm.module.css
│   │   ├── InspectionForm.tsx
│   │   ├── InspectionModeSelector.module.css
│   │   ├── InspectionModeSelector.tsx
│   │   ├── LocationModeSwitcher.module.css
│   │   ├── LocationModeSwitcher.tsx
│   │   ├── PhotoCapture.module.css
│   │   ├── PhotoCapture.tsx
│   │   ├── PhotoModeSwitcher.module.css
│   │   ├── PhotoModeSwitcher.tsx
│   │   ├── PhotoPreview.tsx
│   │   ├── QRScannerModal.module.css
│   │   ├── QRSCannerModal.tsx
│   │   ├── SeedTemplateButton.tsx
│   │   ├── UIModeSwitcher.module.css
│   │   └── UIModeSwitcher.tsx
│   ├── InspectionForm.backup.tsx
│   ├── inspection.types.aligned.ts
│   └── inspection.types.backup.ts
├── dist
│   └── scripts
│       ├── infrastructure
│       │   └── database
│       │       └── repositories
│       ├── lib
│       │   └── constants
│       └── scripts
├── file.md
│   ├── COMPONENT_RATING_FIX.md
│   ├── error-phase3.md
│   ├── FIX_USE_INSPECTION.md
│   ├── INSPECTION.SETUP.md
│   ├── MANUAL_FIXES_NEEDED.md
│   ├── PERFORMANCE_FIX.md
│   ├── QUICK_START.md
│   ├── REMAINING_FIXES.md
│   ├── RLS_FIX_guide.md
│   ├── SEED_GUIDE.md
│   ├── STEP_BY_STEP_ADD_TEAMPLATE.md
│   └── tree-project.md
├── file.sh
│   ├── final-type-fix.sh
│   ├── fix-errors.sh
│   ├── fix-null-checks.txt
│   ├── fix-remaining-errors.sh
│   ├── fix-type-errors.sh
│   ├── manual-fixes-needed.txt
│   ├── setup-refactor.sh
│   ├── temp_photopreview_fix.txt
│   ├── type-check-after-json-fix.txt
│   ├── type-check-final.txt
│   └── type-check-results.txt
├── get-docker.sh
├── LICENSE
├── middleware.ts
├── next.config.js
├── next.config.mjs
├── next-env.d.ts
├── node_modules
│   ├── autoprefixer -> .pnpm/autoprefixer@10.4.21_postcss@8.5.6/node_modules/autoprefixer
│   ├── @babel
│   │   └── runtime -> ../.pnpm/@babel+runtime@7.28.4/node_modules/@babel/runtime
│   ├── cloudinary -> .pnpm/cloudinary@2.7.0/node_modules/cloudinary
│   ├── eslint -> .pnpm/eslint@8.57.1/node_modules/eslint
│   ├── eslint-config-next -> .pnpm/eslint-config-next@14.2.33_eslint@8.57.1_typescript@5.6.3/node_modules/eslint-config-next
│   ├── final-fix-all.sh
│   ├── html5-qrcode -> .pnpm/html5-qrcode@2.3.8/node_modules/html5-qrcode
│   ├── jsqr -> .pnpm/jsqr@1.4.0/node_modules/jsqr
│   ├── lucide-react -> .pnpm/lucide-react@0.546.0_react@19.2.0/node_modules/lucide-react
│   ├── @next
│   │   └── bundle-analyzer -> ../.pnpm/@next+bundle-analyzer@15.5.6/node_modules/@next/bundle-analyzer
│   ├── next -> .pnpm/next@15.5.6_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next
│   ├── node -> .pnpm/node@25.0.0/node_modules/node
│   ├── postcss -> .pnpm/postcss@8.5.6/node_modules/postcss
│   ├── prettier -> .pnpm/prettier@3.6.2/node_modules/prettier
│   ├── qrcode.react -> .pnpm/qrcode.react@4.2.0_react@19.2.0/node_modules/qrcode.react
│   ├── react -> .pnpm/react@19.2.0/node_modules/react
│   ├── react-dom -> .pnpm/react-dom@19.2.0_react@19.2.0/node_modules/react-dom
│   ├── react-qr-scanner -> .pnpm/react-qr-scanner@1.0.0-alpha.11_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/react-qr-scanner
│   ├── @supabase
│   │   ├── auth-helpers-nextjs -> ../.pnpm/@supabase+auth-helpers-nextjs@0.8.7_@supabase+supabase-js@2.75.1/node_modules/@supabase/auth-helpers-nextjs
│   │   └── supabase-js -> ../.pnpm/@supabase+supabase-js@2.75.1/node_modules/@supabase/supabase-js
│   ├── @tailwindcss
│   │   └── postcss -> ../.pnpm/@tailwindcss+postcss@4.1.14/node_modules/@tailwindcss/postcss
│   ├── tailwindcss -> .pnpm/tailwindcss@4.1.14/node_modules/tailwindcss
│   ├── tsconfig-paths -> .pnpm/tsconfig-paths@4.2.0/node_modules/tsconfig-paths
│   ├── @types
│   │   ├── node -> ../.pnpm/@types+node@20.19.22/node_modules/@types/node
│   │   ├── react -> ../.pnpm/@types+react@18.3.26/node_modules/@types/react
│   │   └── react-dom -> ../.pnpm/@types+react-dom@18.3.7_@types+react@18.3.26/node_modules/@types/react-dom
│   └── typescript -> .pnpm/typescript@5.6.3/node_modules/typescript
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.js
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── icons
│   ├── manifest.json
│   ├── next.svg
│   ├── qr-codes
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── scripts
│   ├── fix-template.ts
│   ├── seed-inspection-template.ts
│   ├── seed.ts
│   └── setup-database.sql
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── check
│   │   │   │   └── template
│   │   │   │       └── routes.ts
│   │   │   ├── inspections
│   │   │   │   └── route.ts
│   │   │   ├── locations
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   ├── route.ts
│   │   │   │   └── test
│   │   │   │       └── route.ts
│   │   │   ├── photos
│   │   │   │   └── delete
│   │   │   │       └── route.ts
│   │   │   ├── seed
│   │   │   │   └── template
│   │   │   │       └── route.ts
│   │   │   ├── templates
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── upload
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   ├── history
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   ├── inspection
│   │   │   │   ├── [locationId]
│   │   │   │   │   ├── page.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── page.module.css
│   │   │   │   ├── page.tsx
│   │   │   │   └── success
│   │   │   │       ├── page.module.css
│   │   │   │       └── page.tsx
│   │   │   ├── layout.module.css
│   │   │   ├── layout.tsx
│   │   │   ├── locations
│   │   │   │   ├── bulk
│   │   │   │   │   ├── bulk.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── create
│   │   │   │   │   ├── create.module.css
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]
│   │   │   │   │   └── qr
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── qr.module.css
│   │   │   │   ├── locations.module.css
│   │   │   │   ├── page.tsx
│   │   │   │   └── print-qr
│   │   │   │       ├── page.tsx
│   │   │   │       └── print-qr.module.css
│   │   │   ├── page.module.css
│   │   │   ├── page.tsx
│   │   │   ├── reports
│   │   │   │   ├── error.tsx
│   │   │   │   ├── page.module.css
│   │   │   │   └── page.tsx
│   │   │   └── scan
│   │   │       ├── [code]
│   │   │       │   ├── page.tsx
│   │   │       │   └── scan.module.css
│   │   │       ├── page.module.css
│   │   │       └── page.tsx
│   │   ├── debug
│   │   │   └── template
│   │   │       └── page.tsx
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── landing.module.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── login
│   │   │   ├── layout.tsx
│   │   │   ├── login.module.css
│   │   │   └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── seed
│   │   │   ├── page.tsx
│   │   │   └── seed.module.css
│   │   └── setup
│   │       ├── page.tsx
│   │       └── setup.module.css
│   ├── components
│   │   ├── inspection
│   │   │   └── QRScanner.tsx
│   │   ├── layout
│   │   │   ├── BottomNav
│   │   │   │   ├── BottomNav.module.css
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── index.ts
│   │   │   └── Header
│   │   │       ├── Header.module.css
│   │   │       ├── Header.tsx
│   │   │       └── index.ts
│   │   └── ui
│   │       ├── Button
│   │       │   ├── Button.module.css
│   │       │   ├── Button.tsx
│   │       │   └── index.ts
│   │       ├── Card
│   │       │   ├── Card.module.css
│   │       │   ├── Card.tsx
│   │       │   └── index.ts
│   │       ├── EmptyLocationsState.tsx
│   │       ├── index.ts
│   │       ├── Input
│   │       │   ├── index.ts
│   │       │   ├── Input.module.css
│   │       │   └── Input.tsx
│   │       ├── Modal
│   │       │   ├── index.ts
│   │       │   ├── Modal.module.css
│   │       │   └── Modal.tsx
│   │       ├── Skeleton.tsx
│   │       └── Toast.tsx
│   ├── core
│   │   ├── constants
│   │   │   └── inspection.constant.ts
│   │   ├── dtos
│   │   │   └── CreateInspectionDTO.ts
│   │   ├── entities
│   │   │   ├── InspectionEntity.ts
│   │   │   ├── InspectionTemplate.ts
│   │   │   ├── Inspection.ts
│   │   │   ├── Location.ts
│   │   │   └── User.ts
│   │   ├── repositories
│   │   │   ├── IAuthRepository.ts
│   │   │   ├── IInspectionRepository.ts
│   │   │   ├── ILocationRepository.ts
│   │   │   ├── IPhotoRepository.ts
│   │   │   └── IUserRepository.ts
│   │   ├── types
│   │   │   ├── database.types.ts
│   │   │   ├── enums.ts
│   │   │   ├── index.ts
│   │   │   ├── inspection.types.ts
│   │   │   ├── interfaces.ts
│   │   │   ├── location.types.ts
│   │   │   ├── user-role.enum.ts
│   │   │   └── user.types.ts
│   │   └── use-cases
│   │       ├── BulkCreateLocations.ts
│   │       ├── CreateLocation.ts
│   │       ├── DeleteLocation.ts
│   │       ├── GetCurrentUserUseCase.ts
│   │       ├── GetLocationByCode.ts
│   │       ├── GetLocationById.ts
│   │       ├── GetLocationsByBuilding.ts
│   │       ├── GetLocationsByFloor.ts
│   │       ├── GetLocations.ts
│   │       ├── index.ts
│   │       ├── SearchLocations.ts
│   │       ├── SubscribeToLocations.ts
│   │       └── UpdateLocation.ts
│   ├── domain
│   │   ├── inspection
│   │   │   ├── hooks
│   │   │   ├── services
│   │   │   │   └── cloudinary.service.ts
│   │   │   └── utils
│   │   │       └── validation.ts
│   │   ├── location
│   │   ├── shared
│   │   └── user
│   ├── infrastructure
│   │   ├── auth
│   │   │   └── supabase-auth.ts
│   │   ├── database
│   │   │   ├── repositories
│   │   │   │   ├── InspectionTemplateRepository.ts
│   │   │   │   ├── SupabaseLocationRepository.ts
│   │   │   │   └── SupabaseUserRepository.ts
│   │   │   └── supabase.ts
│   │   ├── services
│   │   │   ├── cloudinary.service.ts
│   │   │   ├── index.ts
│   │   │   ├── location.service.ts
│   │   │   ├── notification.service.ts
│   │   │   └── template.service.ts
│   │   └── storage
│   │       └── CloudinaryPhotoRepository.ts
│   ├── lib
│   │   ├── auto-cache.ts
│   │   ├── constants
│   │   │   ├── locations.ts
│   │   │   └── roles.ts
│   │   ├── di.ts
│   │   ├── seed
│   │   │   └── seedTemplate.ts
│   │   ├── supabase
│   │   │   ├── cleint.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   ├── supabase.client.ts
│   │   └── utils
│   │       ├── calendar.ts
│   │       ├── cloudinary.client.ts
│   │       ├── date.ts
│   │       ├── index.ts
│   │       └── type-helpers.ts
│   ├── presentation
│   │   ├── components
│   │   │   ├── features
│   │   │   │   ├── Inspection
│   │   │   │   │   ├── QRScannerModal.module.css
│   │   │   │   │   ├── QRSCannerModal.tsx
│   │   │   │   │   └── SeedTemplateButton.tsx
│   │   │   │   ├── LocationForm
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── LocationForm.tsx
│   │   │   │   ├── locations
│   │   │   │   │   ├── LocationCard.module.css
│   │   │   │   │   ├── LocationCard.tsx
│   │   │   │   │   ├── LocationStats.module.css
│   │   │   │   │   ├── LocationStats.tsx
│   │   │   │   │   ├── QRCodeDisplay.module.css
│   │   │   │   │   └── QRCodeDisplay.tsx
│   │   │   │   ├── LocationSelector
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── LocationSelector.module.css
│   │   │   │   │   └── LocationSelector.tsx
│   │   │   │   └── Reports
│   │   │   │       ├── index.ts
│   │   │   │       ├── InspectionDetailModal.module.css
│   │   │   │       ├── InspectionDetailModal.tsx
│   │   │   │       ├── InspectionDetailModal.types.ts
│   │   │   │       ├── ReportFilters.module.css
│   │   │   │       ├── ReportFilters.tsx
│   │   │   │       ├── WeeklyReport.module.css
│   │   │   │       └── WeeklyReport.tsx
│   │   │   ├── layout
│   │   │   │   ├── BottomNav
│   │   │   │   │   ├── BottomNav.module.css
│   │   │   │   │   ├── BottomNav.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── Header
│   │   │   │       ├── Header.module.css
│   │   │   │       ├── Header.tsx
│   │   │   │       └── index.ts
│   │   │   └── ui
│   │   │       ├── Button
│   │   │       │   ├── Button.module.css
│   │   │       │   ├── Button.tsx
│   │   │       │   └── index.ts
│   │   │       ├── Card
│   │   │       │   ├── Card.module.css
│   │   │       │   ├── Card.tsx
│   │   │       │   └── index.ts
│   │   │       ├── EmptyLocationsState.tsx
│   │   │       ├── index.ts
│   │   │       ├── Input
│   │   │       │   ├── index.ts
│   │   │       │   ├── Input.module.css
│   │   │       │   └── Input.tsx
│   │   │       ├── Modal
│   │   │       │   ├── index.ts
│   │   │       │   ├── Modal.module.css
│   │   │       │   └── Modal.tsx
│   │   │       ├── Skeleton.tsx
│   │   │       └── Toast.tsx
│   │   ├── contexts
│   │   │   └── AuthContext.tsx
│   │   ├── hooks
│   │   │   ├── useNotification.ts
│   │   │   └── useTimer.ts
│   │   └── styles
│   │       └── tokens.css
│   └── types
│       ├── css-modules.d.ts
│       ├── global.d.ts
│       ├── html5-qrcode.d.ts
│       ├── index.ts
│       └── supabase.d.ts
├── supabase
│   └── config.toml
├── tailwind.config.js
├── test-data.sql
├── test-insert.sql
├── tsc
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vercel.json

140 directories, 269 files
dracarys@pop-os:~$ 