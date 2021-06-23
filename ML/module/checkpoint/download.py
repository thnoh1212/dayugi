import pathlib
from google_drive_downloader import GoogleDriveDownloader as gdd

if __name__ == "__main__":
    
    root_path = str(pathlib.Path(__file__).parent.absolute())

    kogpt2_file_id = '1jcVcLnnV2jL-j0gGKishdwfZywqg8R80'
    kobert_file_id = '1uJzQzktpNaI9-PtWe2i4VQguLmMml8zh'

    kogpt2_destination = root_path + '/kogpt2-wellness-auto-regressive.pth'
    kobert_destination = root_path + '/kobert_emotion_classification.pth'

    kogpt2_url = 'https://drive.google.com/file/d/1jcVcLnnV2jL-j0gGKishdwfZywqg8R80/uc?export=download'
    kobert_url = 'https://drive.google.com/file/d/1uJzQzktpNaI9-PtWe2i4VQguLmMml8zh/uc?export=download'
    
    gdd.download_file_from_google_drive(file_id=kogpt2_file_id, dest_path=kogpt2_destination, showsize=True)
    gdd.download_file_from_google_drive(file_id=kobert_file_id, dest_path=kobert_destination, showsize=True)