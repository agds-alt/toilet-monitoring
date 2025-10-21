dracarys@pop-os:~/toilet-monitoring$ tp

> toilet-monitoring@1.0.0 type-check /DataPopOS/toilet-monitoring
> tsc --noEmit

.next/types/app/api/templates/[id]/route.ts:12:13 - error TS2344: Type 'OmitWithTag<typeof import("/DataPopOS/toilet-monitoring/src/app/api/templates/[id]/route"), "POST" | "GET" | "PATCH" | "DELETE" | "config" | "generateStaticParams" | "revalidate" | "dynamic" | ... 7 more ... | "PUT", "">' does not satisfy the constraint '{ [x: string]: never; }'.
  Property 'getDefaultTemplate' is incompatible with index signature.
    Type '() => Promise<any>' is not assignable to type 'never'.

 12 checkFields<Diff<{
                ~~~~~~
 13   GET?: Function
    ~~~~~~~~~~~~~~~~
... 
 29 
    
 30 }, TEntry, ''>>()
    ~~~~~~~~~~~~~~

.next/types/app/api/templates/[id]/route.ts:49:7 - error TS2344: Type '{ __tag__: "GET"; __param_position__: "second"; __param_type__: RouteParams; }' does not satisfy the constraint 'ParamCheck<RouteContext>'.
  The types of '__param_type__.params' are incompatible between these types.
    Type '{ id: string; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]

 49       {
          ~
 50         __tag__: 'GET'
    ~~~~~~~~~~~~~~~~~~~~~~
... 
 52         __param_type__: SecondArg<MaybeField<TEntry, 'GET'>>
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 53       },
    ~~~~~~~

.next/types/validator.ts:288:31 - error TS2344: Type 'typeof import("/DataPopOS/toilet-monitoring/src/app/api/templates/[id]/route")' does not satisfy the constraint 'RouteHandlerConfig<"/api/templates/[id]">'.
  Types of property 'GET' are incompatible.
    Type '(request: NextRequest, { params }: RouteParams) => Promise<NextResponse<{ error: string; }> | NextResponse<{ success: boolean; data: any; }>>' is not assignable to type '(request: NextRequest, context: { params: Promise<{ id: string; }>; }) => void | Response | Promise<void | Response>'.
      Types of parameters '__1' and 'context' are incompatible.
        Type '{ params: Promise<{ id: string; }>; }' is not assignable to type 'RouteParams'.
          Types of property 'params' are incompatible.
            Property 'id' is missing in type 'Promise<{ id: string; }>' but required in type '{ id: string; }'.

288   type __Check = __IsExpected<typeof handler>
                                  ~~~~~~~~~~~~~~

  src/app/api/templates/[id]/route.ts:11:5
    11     id: string;
           ~~
    'id' is declared here.

src/app/dashboard/inspection/page.tsx:26:8 - error TS2741: Property 'templateId' is missing in type '{ userId: string; onSuccess: (inspectionId: string) => void; onCancel: () => void; }' but required in type 'InspectionFormProps'.

26       <InspectionForm userId={user.id} onSuccess={handleSuccess} onCancel={handleCancel} />
          ~~~~~~~~~~~~~~

  src/presentation/components/features/Inspection/InspectionForm.tsx:78:3
    78   templateId: string;
         ~~~~~~~~~~
    'templateId' is declared here.

src/app/dashboard/inspection/success/page.tsx:38:44 - error TS2339: Property 'getInspectionById' does not exist on type '{ create(dto: CreateInspectionDTO): Promise<Database>; getById(id: string): Promise<any>; }'.

38       const data = await inspectionService.getInspectionById(id);
                                              ~~~~~~~~~~~~~~~~~

src/app/dashboard/inspection/success/page.tsx:63:40 - error TS18046: 'response' is of type 'unknown'.

63             .filter(([_, response]) => response.rating <= 2)
                                          ~~~~~~~~

src/app/dashboard/inspection/success/page.tsx:171:29 - error TS7053: Element implicitly has an 'any' type because expression of type '1 | 2 | 3 | 5 | 4' can't be used to index type 'Record<RatingValue, number>'.
  Property '1' does not exist on type 'Record<RatingValue, number>'.

171               const count = stats.breakdown[rating as 1 | 2 | 3 | 4 | 5];
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/dashboard/layout.tsx:78:56 - error TS2339: Property 'role' does not exist on type 'User'.

78                   <p className={styles.userRole}>{user.role}</p>
                                                          ~~~~

src/app/dashboard/locations/print-qr/page.tsx:48:13 - error TS2345: Argument of type '() => () => HTMLStyleElement' is not assignable to parameter of type 'EffectCallback'.
  Type '() => HTMLStyleElement' is not assignable to type 'void | Destructor'.
    Type '() => HTMLStyleElement' is not assignable to type 'Destructor'.
      Type 'HTMLStyleElement' is not assignable to type 'void | { [UNDEFINED_VOID_ONLY]: never; }'.

48   useEffect(() => {
               ~~~~~~~

src/app/dashboard/scan/page.tsx:12:10 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'LocationData'. Did you mean 'GeolocationData'?

12 import { LocationData } from '@/core/types/inspection.types';
            ~~~~~~~~~~~~

src/app/inspection/success/page.tsx:32:46 - error TS2339: Property 'getInspectionById' does not exist on type '{ create(dto: CreateInspectionDTO): Promise<Database>; getById(id: string): Promise<any>; }'.

32         const data = await inspectionService.getInspectionById(inspectionId);
                                                ~~~~~~~~~~~~~~~~~

src/app/inspection/success/page.tsx:67:5 - error TS2571: Object is of type 'unknown'.

67     Object.values(inspection.responses).reduce((sum, r) => sum + r.rating, 0) /
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/app/inspection/success/page.tsx:67:66 - error TS18046: 'r' is of type 'unknown'.

67     Object.values(inspection.responses).reduce((sum, r) => sum + r.rating, 0) /
                                                                    ~

src/core/repositories/IInspectionRepository.ts:3:10 - error TS2305: Module '"@/core/entities/Inspection"' has no exported member 'InspectionEntity'.

3 import { InspectionEntity } from '@/core/entities/Inspection';
           ~~~~~~~~~~~~~~~~

src/core/repositories/IInspectionRepository.ts:4:41 - error TS2307: Cannot find module '@/core/use-cases/GetInspectionHistory' or its corresponding type declarations.

4 import { GetInspectionHistoryDTO } from '@/core/use-cases/GetInspectionHistory';
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/core/repositories/IInspectionRepository.ts:16:10 - error TS2305: Module '"@/core/entities/User"' has no exported member 'UserEntity'.

16 import { UserEntity } from '@/core/entities/User';
            ~~~~~~~~~~

src/core/repositories/IPhotoRepository.ts:2:23 - error TS2307: Cannot find module '@/core/entities/Photo' or its corresponding type declarations.

2 import { Photo } from '@/core/entities/Photo';
                        ~~~~~~~~~~~~~~~~~~~~~~~

src/core/types/database.types.ts:2:31 - error TS2307: Cannot find module '@/supabase.types' or its corresponding type declarations.

2 import type { Database } from '@/supabase.types';
                                ~~~~~~~~~~~~~~~~~~

src/core/use-cases/GetCurrentUserUseCase.ts:4:10 - error TS2305: Module '"../entities/User"' has no exported member 'UserEntity'.

4 import { UserEntity } from '../entities/User';
           ~~~~~~~~~~

src/core/use-cases/UploadPhoto.ts:31:71 - error TS2554: Expected 1 arguments, but got 2.

31     const photoUrl = await this.photoRepository.upload(dto.photoData, dto.metadata);
                                                                         ~~~~~~~~~~~~

src/infrastructure/database/supabase.ts:3:31 - error TS2307: Cannot find module '@/supabase.types' or its corresponding type declarations.

3 import type { Database } from '@/supabase.types';
                                ~~~~~~~~~~~~~~~~~~

src/infrastructure/services/cloudinary.service.ts:78:81 - error TS2339: Property 'locationId' does not exist on type 'PhotoUploadItem'.

78       items.map((item) => this.uploadPhoto(item.file, item.fieldReference, item.locationId))
                                                                                   ~~~~~~~~~~

src/infrastructure/services/notification.service.ts:15:13 - error TS2552: Cannot find name 'NotificationAction'. Did you mean 'NotificationOptions'?

15   actions?: NotificationAction[];
               ~~~~~~~~~~~~~~~~~~

src/infrastructure/services/notification.service.ts:88:11 - error TS2353: Object literal may only specify known properties, and 'actions' does not exist in type 'NotificationOptions'.

88           actions: options.actions || [],
             ~~~~~~~

src/infrastructure/storage/CloudinaryPhotoRepository.ts:2:28 - error TS2305: Module '"@/core/repositories/IPhotoRepository"' has no exported member 'PhotoMetadata'.

2 import { IPhotoRepository, PhotoMetadata } from '@/core/repositories/IPhotoRepository';
                             ~~~~~~~~~~~~~

src/infrastructure/storage/CloudinaryPhotoRepository.ts:13:9 - error TS2416: Property 'upload' in type 'CloudinaryPhotoRepository' is not assignable to the same property in base type 'IPhotoRepository'.
  Type '(photoData: string, metadata: PhotoMetadata) => Promise<string>' is not assignable to type '(photoData: { file_url: string; file_name?: string | null | undefined; file_size?: number | null | undefined; mime_type?: string | null | undefined; caption?: string | null | undefined; inspection_id?: string | ... 1 more ... | undefined; location_id?: string | ... 1 more ... | undefined; uploaded_by?: string | ... ...'.
    Target signature provides too few arguments. Expected 2 or more, but got 1.

13   async upload(photoData: string, metadata: PhotoMetadata): Promise<string> {
           ~~~~~~

src/lib/di.ts:19:10 - error TS2305: Module '"@/core/use-cases/CreateLocation"' has no exported member 'CreateLocation'.

19 import { CreateLocation } from '@/core/use-cases/CreateLocation';
            ~~~~~~~~~~~~~~

src/lib/di.ts:20:10 - error TS2305: Module '"@/core/use-cases/UpdateLocation"' has no exported member 'UpdateLocation'.

20 import { UpdateLocation } from '@/core/use-cases/UpdateLocation';
            ~~~~~~~~~~~~~~

src/lib/utils/geolocation.utils.ts:119:7 - error TS2353: Object literal may only specify known properties, and 'city' does not exist in type 'Partial<GeolocationData>'.

119       city: formattedAddress.city,
          ~~~~

src/lib/utils/rating.utils.ts:8:3 - error TS2724: '"@/core/types/inspection.types"' has no exported member named 'InspectionStatus'. Did you mean 'InspectionUIState'?

8   InspectionStatus,
    ~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:19 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:19 - error TS2531: Object is possibly 'null'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:32:44 - error TS2769: No overload matches this call.
  Overload 1 of 3, '(callbackfn: (previousValue: RatingValue | null, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => RatingValue | null, initialValue: RatingValue | null): RatingValue | null', gave the following error.
    Type 'string' is not assignable to type 'RatingValue | null'.
  Overload 2 of 3, '(callbackfn: (previousValue: number, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => number, initialValue: number): number', gave the following error.
    Type 'string' is not assignable to type 'number'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                              ~~~~~

  node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1489:24
    1489     reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.
  node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1495:27
    1495     reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.

src/lib/utils/rating.utils.ts:32:48 - error TS18047: 'b' is possibly 'null'.

32   const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                                                  ~

src/lib/utils/rating.utils.ts:54:40 - error TS2769: No overload matches this call.
  Overload 1 of 3, '(callbackfn: (previousValue: RatingValue | null, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => RatingValue | null, initialValue: RatingValue | null): RatingValue | null', gave the following error.
    Type 'string' is not assignable to type 'RatingValue | null'.
  Overload 2 of 3, '(callbackfn: (previousValue: number, currentValue: RatingValue | null, currentIndex: number, array: (RatingValue | null)[]) => number, initialValue: number): number', gave the following error.
    Type 'string' is not assignable to type 'number'.

54   const sum = ratings.reduce((a, b) => a + b, 0);
                                          ~~~~~

  node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1489:24
    1489     reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.
  node_modules/.pnpm/typescript@5.9.3/node_modules/typescript/lib/lib.es5.d.ts:1495:27
    1495     reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The expected type comes from the return type of this signature.

src/lib/utils/rating.utils.ts:54:44 - error TS18047: 'b' is possibly 'null'.

54   const sum = ratings.reduce((a, b) => a + b, 0);
                                              ~

src/lib/utils/rating.utils.ts:55:18 - error TS2362: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

55   return Number((sum / ratings.length).toFixed(2));
                    ~~~

src/lib/utils/rating.utils.ts:55:18 - error TS18047: 'sum' is possibly 'null'.

55   return Number((sum / ratings.length).toFixed(2));
                    ~~~

src/lib/utils/rating.utils.ts:75:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'RatingValue' can't be used to index type 'Record<1 | 2 | 3 | 5 | 4, string>'.
  Property 'clean' does not exist on type 'Record<1 | 2 | 3 | 5 | 4, string>'.

75   return RATING_EMOJI_MAP[rating] || '😐';
            ~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:86:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'RatingValue' can't be used to index type 'Record<1 | 2 | 3 | 5 | 4, { en: string; id: string; }>'.
  Property 'clean' does not exist on type 'Record<1 | 2 | 3 | 5 | 4, { en: string; id: string; }>'.

86   return RATING_LABEL_MAP[rating]?.[lang] || 'Unknown';
            ~~~~~~~~~~~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:106:10 - error TS7053: Element implicitly has an 'any' type because expression of type 'InspectionStatus' can't be used to index type '{ Excellent: { bg: string; text: string; badge: string; }; Good: { bg: string; text: string; badge: string; }; Fair: { bg: string; text: string; badge: string; }; Poor: { bg: string; text: string; badge: string; }; Critical: { ...; }; }'.

106   return colors[status] || colors.Fair;
             ~~~~~~~~~~~~~~

src/lib/utils/rating.utils.ts:165:5 - error TS2353: Object literal may only specify known properties, and '1' does not exist in type 'Record<RatingValue, number>'.

165     1: 0,
        ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:35 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                      ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:38 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                         ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:41 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                            ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:44 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                               ~

src/presentation/components/features/Inspection/ComponentRating.tsx:122:47 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

122   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                                  ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:35 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                      ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:38 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                         ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:41 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                            ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:44 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                               ~

src/presentation/components/features/Inspection/ComponentRating.tsx:160:47 - error TS2322: Type 'number' is not assignable to type 'RatingValue'.

160   const ratings: RatingValue[] = [1, 2, 3, 4, 5];
                                                  ~

src/presentation/components/features/Inspection/InspectionForm.tsx:516:49 - error TS2345: Argument of type 'PhotoUploadItem' is not assignable to parameter of type 'File'.
  Type 'PhotoUploadItem' is missing the following properties from type 'File': lastModified, name, webkitRelativePath, size, and 6 more.

516                   onCapture={(file) => addPhoto(file, component.id)}
                                                    ~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:517:19 - error TS2322: Type '{ onCapture: (file: PhotoUploadItem) => void; mode: PhotoMode; }' is not assignable to type 'IntrinsicAttributes & PhotoCaptureProps'.
  Property 'mode' does not exist on type 'IntrinsicAttributes & PhotoCaptureProps'.

517                   mode={state.photoMode}
                      ~~~~

src/presentation/components/features/Inspection/InspectionForm.tsx:533:19 - error TS2322: Type '(preview: string) => void' is not assignable to type '() => void'.
  Target signature provides too few arguments. Expected 1 or more, but got 0.

533                   onRemove={removePhoto}
                      ~~~~~~~~

  src/presentation/components/features/Inspection/PhotoPreview.tsx:8:3
    8   onRemove?: () => void;
        ~~~~~~~~
    The expected type comes from property 'onRemove' which is declared here on type 'IntrinsicAttributes & PhotoPreviewProps'

src/presentation/components/features/Inspection/PhotoCapture.tsx:56:7 - error TS2353: Object literal may only specify known properties, and 'locationId' does not exist in type 'PhotoUploadItem'.

56       locationId,
         ~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:8:21 - error TS2305: Module '"../../../../lib/constants/locations"' has no exported member 'searchLocations'.

8 import { LOCATIONS, searchLocations } from '../../../../lib/constants/locations';
                      ~~~~~~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:23:74 - error TS2345: Argument of type 'Location[]' is not assignable to parameter of type 'Location[] | (() => Location[])'.
  Type 'Location[]' is not assignable to type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location[]'.
    Property 'code' is missing in type 'Location' but required in type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location'.

23   const [filteredLocations, setFilteredLocations] = useState<Location[]>(LOCATIONS);
                                                                            ~~~~~~~~~

  src/core/types/interfaces.ts:24:3
    24   code: string;
         ~~~~
    'code' is declared here.

src/presentation/components/features/LocationSelector/LocationSelector.tsx:31:28 - error TS2345: Argument of type 'Location[]' is not assignable to parameter of type 'SetStateAction<Location[]>'.
  Type 'Location[]' is not assignable to type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location[]'.
    Property 'code' is missing in type 'Location' but required in type 'import("/DataPopOS/toilet-monitoring/src/core/types/interfaces").Location'.

31       setFilteredLocations(LOCATIONS);
                              ~~~~~~~~~

  src/core/types/interfaces.ts:24:3
    24   code: string;
         ~~~~
    'code' is declared here.

src/presentation/components/features/LocationSelector/LocationSelector.tsx:91:15 - error TS2322: Type '"default" | "selected"' is not assignable to type '"default" | "elevated" | "outlined" | undefined'.
  Type '"selected"' is not assignable to type '"default" | "elevated" | "outlined" | undefined'.

91               variant={selectedLocationId === location.id ? 'selected' : 'default'}
                 ~~~~~~~

  src/presentation/components/ui/Card/Card.tsx:13:3
    13   variant?: 'default' | 'elevated' | 'outlined';
         ~~~~~~~
    The expected type comes from property 'variant' which is declared here on type 'IntrinsicAttributes & CardProps'

src/presentation/components/features/LocationSelector/LocationSelector.tsx:94:27 - error TS7006: Parameter 'e' implicitly has an 'any' type.

94               onKeyDown={(e) => handleKeyPress(e, location)}
                             ~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:106:29 - error TS2339: Property 'description' does not exist on type 'Location'.

106                   {location.description && (
                                ~~~~~~~~~~~

src/presentation/components/features/LocationSelector/LocationSelector.tsx:107:68 - error TS2339: Property 'description' does not exist on type 'Location'.

107                     <span className={styles.description}>{location.description}</span>
                                                                       ~~~~~~~~~~~

src/presentation/components/features/PhotoCapture/index.ts:1:41 - error TS2307: Cannot find module './PhotoCapture/PhotoCapture' or its corresponding type declarations.

1 export { default as PhotoCapture } from './PhotoCapture/PhotoCapture';
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/Reports/InspectionDetailModal.tsx:8:10 - error TS2305: Module '"@/core/entities/Inspection"' has no exported member 'InspectionEntity'.

8 import { InspectionEntity } from '@/core/entities/Inspection';
           ~~~~~~~~~~~~~~~~

src/presentation/components/features/Reports/InspectionDetailModal.tsx:220:71 - error TS2339: Property 'icon' does not exist on type 'AssessmentCategory'.

220                       <span className={styles.assessmentIcon}>{config.icon}</span>
                                                                          ~~~~

src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:150:34 - error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'Assessments'.
  No index signature with a parameter of type 'string' was found on type 'Assessments'.

150               const assessment = assessments[config.id];
                                     ~~~~~~~~~~~~~~~~~~~~~~

src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:160:69 - error TS2339: Property 'icon' does not exist on type 'AssessmentCategory'.

160                     <span className={styles.assessmentIcon}>{config.icon}</span>
                                                                        ~~~~

src/presentation/components/layout/Header/Header.tsx:29:49 - error TS2339: Property 'role' does not exist on type 'User'.

29         <span className={styles.userRole}>{user.role}</span>
                                                   ~~~~

src/presentation/hooks/useInspection.ts:47:5 - error TS2322: Type 'null' is not assignable to type 'number'.

47     startTime: null,
       ~~~~~~~~~

src/presentation/hooks/useInspection.ts:52:7 - error TS2353: Object literal may only specify known properties, and 'currentStep' does not exist in type 'InspectionUIState'.

52       currentStep: 1,
         ~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:135:25 - error TS2339: Property 'isDraft' does not exist on type 'InspectionUIState'.

135       if (state.uiState.isDraft && Object.keys(state.responses).length > 0) {
                            ~~~~~~~

src/presentation/hooks/useInspection.ts:221:20 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

221       photos: prev.photos.filter((p) => p.id !== photoId),
                       ~~~~~~

src/presentation/hooks/useInspection.ts:221:35 - error TS7006: Parameter 'p' implicitly has an 'any' type.

221       photos: prev.photos.filter((p) => p.id !== photoId),
                                      ~

src/presentation/hooks/useInspection.ts:263:7 - error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'Partial<InspectionFormState>'.

263       id: `draft-${Date.now()}`,
          ~~

src/presentation/hooks/useInspection.ts:289:57 - error TS2339: Property 'id' does not exist on type 'Partial<InspectionFormState>'.

289     const draft = drafts.find((d: InspectionDraft) => d.id === draftId);
                                                            ~~

src/presentation/hooks/useInspection.ts:306:62 - error TS2339: Property 'id' does not exist on type 'Partial<InspectionFormState>'.

306     const filtered = drafts.filter((d: InspectionDraft) => d.id !== draftId);
                                                                 ~~

src/presentation/hooks/useInspection.ts:334:34 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

334       let uploadedPhotos = state.photos;
                                     ~~~~~~

src/presentation/hooks/useInspection.ts:352:41 - error TS7006: Parameter 'p' implicitly has an 'any' type.

352         photo_urls: uploadedPhotos.map((p) => p.file_url),
                                            ~

src/presentation/hooks/useInspection.ts:353:9 - error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.

353         notes: state.notes || undefined,
            ~~~~~

  src/core/types/inspection.types.ts:118:3
    118   notes: string;
          ~~~~~
    The expected type comes from property 'notes' which is declared here on type 'InspectionFormState'

src/presentation/hooks/useInspection.ts:355:9 - error TS2322: Type 'GeolocationData | undefined' is not assignable to type 'GeolocationData | null'.
  Type 'undefined' is not assignable to type 'GeolocationData | null'.

355         geolocation: state.geolocation || undefined,
            ~~~~~~~~~~~

  src/core/types/inspection.types.ts:121:3
    121   geolocation: GeolocationData | null;
          ~~~~~~~~~~~
    The expected type comes from property 'geolocation' which is declared here on type 'InspectionFormState'

src/presentation/hooks/useInspection.ts:359:46 - error TS2339: Property 'submitInspection' does not exist on type '{ create(dto: CreateInspectionDTO): Promise<Database>; getById(id: string): Promise<any>; }'.

359       const result = await inspectionService.submitInspection(formData, uploadedPhotos);
                                                 ~~~~~~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:402:7 - error TS2561: Object literal may only specify known properties, but 'template_id' does not exist in type 'Partial<InspectionFormState>'. Did you mean to write 'templateId'?

402       template_id: state.template.id,
          ~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:406:25 - error TS2339: Property 'photos' does not exist on type 'InspectionFormState'.

406       photo_urls: state.photos.map((p) => p.file_url),
                            ~~~~~~

src/presentation/hooks/useInspection.ts:406:37 - error TS7006: Parameter 'p' implicitly has an 'any' type.

406       photo_urls: state.photos.map((p) => p.file_url),
                                        ~

src/presentation/hooks/useInspection.ts:426:7 - error TS2561: Object literal may only specify known properties, but 'template_id' does not exist in type 'Partial<InspectionFormState>'. Did you mean to write 'templateId'?

426       template_id: state.template.id,
          ~~~~~~~~~~~

src/presentation/hooks/useInspection.ts:445:5 - error TS2322: Type '(photo: PhotoUploadItem) => void' is not assignable to type '(file: File, componentId: string) => void'.
  Types of parameters 'photo' and 'file' are incompatible.
    Type 'File' is missing the following properties from type 'PhotoUploadItem': file, preview, fieldReference

445     addPhoto,
        ~~~~~~~~

  src/core/types/inspection.types.ts:190:3
    190   addPhoto: (file: File, componentId: string) => void;
          ~~~~~~~~
    The expected type comes from property 'addPhoto' which is declared here on type 'UseInspectionReturn'

src/presentation/hooks/useInspection.ts:458:30 - error TS2339: Property 'isSubmitting' does not exist on type 'InspectionUIState'.

458     isLoading: state.uiState.isSubmitting,
                                 ~~~~~~~~~~~~

src/presentation/hooks/usePhotoUpload.ts:80:11 - error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'PhotoMetadata'.

80           id: result.public_id,
             ~~

src/presentation/hooks/usePhotoUpload.ts:94:56 - error TS2339: Property 'file_url' does not exist on type 'PhotoMetadata'.

94         console.log('✅ Photo uploaded:', photoMetadata.file_url);
                                                          ~~~~~~~~

src/presentation/hooks/usePhotoUpload.ts:130:20 - error TS2339: Property 'locationId' does not exist on type 'PhotoUploadItem'.

130               item.locationId,
                       ~~~~~~~~~~


Found 91 errors in 30 files.

Errors  Files
     2  .next/types/app/api/templates/[id]/route.ts:12
     1  .next/types/validator.ts:288
     1  src/app/dashboard/inspection/page.tsx:26
     3  src/app/dashboard/inspection/success/page.tsx:38
     1  src/app/dashboard/layout.tsx:78
     1  src/app/dashboard/locations/print-qr/page.tsx:48
     1  src/app/dashboard/scan/page.tsx:12
     3  src/app/inspection/success/page.tsx:32
     3  src/core/repositories/IInspectionRepository.ts:3
     1  src/core/repositories/IPhotoRepository.ts:2
     1  src/core/types/database.types.ts:2
     1  src/core/use-cases/GetCurrentUserUseCase.ts:4
     1  src/core/use-cases/UploadPhoto.ts:31
     1  src/infrastructure/database/supabase.ts:3
     1  src/infrastructure/services/cloudinary.service.ts:78
     2  src/infrastructure/services/notification.service.ts:15
     2  src/infrastructure/storage/CloudinaryPhotoRepository.ts:2
     2  src/lib/di.ts:19
     1  src/lib/utils/geolocation.utils.ts:119
    13  src/lib/utils/rating.utils.ts:8
    10  src/presentation/components/features/Inspection/ComponentRating.tsx:122
     3  src/presentation/components/features/Inspection/InspectionForm.tsx:516
     1  src/presentation/components/features/Inspection/PhotoCapture.tsx:56
     7  src/presentation/components/features/LocationSelector/LocationSelector.tsx:8
     1  src/presentation/components/features/PhotoCapture/index.ts:1
     2  src/presentation/components/features/Reports/InspectionDetailModal.tsx:8
     2  src/presentation/components/features/ReviewSubmit/ReviewSubmit.tsx:150
     1  src/presentation/components/layout/Header/Header.tsx:29
    19  src/presentation/hooks/useInspection.ts:47
     3  src/presentation/hooks/usePhotoUpload.ts:80
 ELIFECYCLE  Command failed with exit code 1.
dracarys@pop-os:~/toilet-monitoring$ 