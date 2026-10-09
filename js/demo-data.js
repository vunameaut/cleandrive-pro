/**
 * CleanDrive Pro - Realistic Demo Data for instant testing & evaluation
 */
const DEMO_DATA = {
  user: {
    displayName: 'Nguyễn Văn Minh (Demo)',
    emailAddress: 'minh.demo.drive@gmail.com',
    photoLink: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  storageQuota: {
    limit: 16106127360, // 15 GB
    usage: 14210612736, // ~13.23 GB (88% full - critical warning zone!)
    usageInDrive: 11811160064, // ~11.0 GB
    usageInDriveTrash: 2399452672 // ~2.23 GB in Trash!
  },
  files: [
    {
      id: 'demo-f-01',
      name: 'Du_Lich_Da_Nang_4K_Master_Raw.mp4',
      mimeType: 'video/mp4',
      size: 4429185024, // 4.12 GB
      modifiedTime: '2023-08-14T09:12:00.000Z',
      md5Checksum: 'a718b9c2409f81a7b823e59019a4e211',
      trashed: false,
      ownedByMe: true,
      capabilities: { canDelete: true, canTrash: true },
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-02',
      name: 'Backup_Full_Database_2022_Q4.tar.gz',
      mimeType: 'application/gzip',
      size: 2854912000, // 2.66 GB
      modifiedTime: '2022-11-20T14:35:10.000Z',
      md5Checksum: 'f1a9238e811bc2395810239581290349',
      trashed: false,
      ownedByMe: true,
      capabilities: { canDelete: true, canTrash: true },
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-03',
      name: 'Windows_11_Insider_Preview_Build22621.iso',
      mimeType: 'application/x-iso9660-image',
      size: 5120000000, // 4.77 GB
      modifiedTime: '2022-06-11T18:20:00.000Z',
      md5Checksum: '4482910fa82012bc0910582910394857',
      trashed: true, // Trashed item consuming quota
      ownedByMe: true,
      capabilities: { canDelete: true, canTrash: true },
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-shared-game',
      name: 'Palworld V0.7.0 [ddat14game.com].part1.rar',
      mimeType: 'application/vnd.rar',
      size: 15032385536, // 14 GB
      modifiedTime: '2026-01-15T12:00:00.000Z',
      md5Checksum: 'cc99887766554433221100ffeeddccbbaa',
      trashed: false,
      ownedByMe: false, // Shared file!
      capabilities: { canDelete: false, canTrash: false },
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-04',
      name: 'Bo_Hinh_Cuoi_Studio_Print_HighRes.zip',
      mimeType: 'application/zip',
      size: 1980000000, // 1.84 GB
      modifiedTime: '2023-03-05T08:14:00.000Z',
      md5Checksum: 'e823901bca0923058102391039841029',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    // Duplicate Group 1: Duplicate Video
    {
      id: 'demo-f-05',
      name: 'Conference_Keynote_2023_Recording.mp4',
      mimeType: 'video/mp4',
      size: 1240000000, // 1.15 GB
      modifiedTime: '2023-09-10T10:00:00.000Z',
      md5Checksum: 'cc789123456789abcdef0123456789ab',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-06',
      name: 'Conference_Keynote_2023_Recording (Copy 1).mp4',
      mimeType: 'video/mp4',
      size: 1240000000, // 1.15 GB duplicate!
      modifiedTime: '2023-09-12T11:20:00.000Z',
      md5Checksum: 'cc789123456789abcdef0123456789ab',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-07',
      name: 'Conference_Keynote_2023_Recording (Backup).mp4',
      mimeType: 'video/mp4',
      size: 1240000000, // 1.15 GB duplicate 2!
      modifiedTime: '2023-09-15T15:45:00.000Z',
      md5Checksum: 'cc789123456789abcdef0123456789ab',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    // Duplicate Group 2: Photo album duplicate
    {
      id: 'demo-f-08',
      name: 'IMG_20230514_TeamBuilding_PhuQuoc.jpg',
      mimeType: 'image/jpeg',
      size: 14500000, // 14.5 MB
      modifiedTime: '2023-05-14T12:00:00.000Z',
      md5Checksum: '778899aabbccddeeff00112233445566',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-09',
      name: 'IMG_20230514_TeamBuilding_PhuQuoc (1).jpg',
      mimeType: 'image/jpeg',
      size: 14500000, // 14.5 MB duplicate!
      modifiedTime: '2023-05-18T16:10:00.000Z',
      md5Checksum: '778899aabbccddeeff00112233445566',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    // Trashed large files
    {
      id: 'demo-f-10',
      name: 'Old_Project_Archive_Do_Not_Use.rar',
      mimeType: 'application/vnd.rar',
      size: 890000000, // 890 MB
      modifiedTime: '2021-04-12T07:30:00.000Z',
      md5Checksum: '332211ffeeddccbbaa99887766554433',
      trashed: true,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-11',
      name: 'Screen_Recording_Bug_Reproduce_1080p.mov',
      mimeType: 'video/quicktime',
      size: 450000000, // 450 MB
      modifiedTime: '2023-11-01T14:10:00.000Z',
      md5Checksum: '5566778899aabbccddeeff0011223344',
      trashed: true,
      webViewLink: 'https://drive.google.com'
    },
    // Old files (> 2 years old)
    {
      id: 'demo-f-12',
      name: 'Bao_Cao_Tai_Chinh_Q3_2020_Final_Signed.pdf',
      mimeType: 'application/pdf',
      size: 45200000, // 45.2 MB
      modifiedTime: '2020-10-15T09:00:00.000Z',
      md5Checksum: 'bbccddeeff00112233445566778899aa',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-13',
      name: 'Khoa_Hoc_Photoshop_Full_Tutorials.zip',
      mimeType: 'application/zip',
      size: 1650000000, // 1.65 GB
      modifiedTime: '2021-01-19T20:12:00.000Z',
      md5Checksum: 'aabbccddee11223344556677889900ff',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-14',
      name: 'Podcast_Ep12_Audio_Master_Lossless.wav',
      mimeType: 'audio/wav',
      size: 380000000, // 380 MB
      modifiedTime: '2022-03-08T11:45:00.000Z',
      md5Checksum: '11223344556677889900aabbccddeeff',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    // Zero byte ghost files
    {
      id: 'demo-f-15',
      name: 'crash_dump_2023_error.log',
      mimeType: 'text/plain',
      size: 0,
      modifiedTime: '2023-12-01T04:12:00.000Z',
      md5Checksum: null,
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-16',
      name: 'download_temp_incomplete.tmp',
      mimeType: 'application/octet-stream',
      size: 0,
      modifiedTime: '2023-12-05T08:30:00.000Z',
      md5Checksum: null,
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-17',
      name: 'empty_test_marker.txt',
      mimeType: 'text/plain',
      size: 0,
      modifiedTime: '2024-01-02T13:00:00.000Z',
      md5Checksum: null,
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    // Common work files
    {
      id: 'demo-f-18',
      name: 'Brand_Identity_Guidelines_Vector_2024.psd',
      mimeType: 'image/vnd.adobe.photoshop',
      size: 320000000, // 320 MB
      modifiedTime: '2024-02-15T16:40:00.000Z',
      md5Checksum: '99887766554433221100ffeeddccbbaa',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-19',
      name: 'Slide_Thuyet_Trinh_Nha_Dau_Tu_Series_A.pptx',
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 85000000, // 85 MB
      modifiedTime: '2024-03-01T10:15:00.000Z',
      md5Checksum: '7766554433221100ffeeddccbbaa9988',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    },
    {
      id: 'demo-f-20',
      name: 'Danh_Sach_Kiem_Ke_Tai_San_Doanh_Nghiep.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: 12500000, // 12.5 MB
      modifiedTime: '2024-02-28T09:30:00.000Z',
      md5Checksum: '554433221100ffeeddccbbaa99887766',
      trashed: false,
      webViewLink: 'https://drive.google.com'
    }
  ]
};
