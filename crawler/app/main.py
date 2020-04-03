from time import sleep
from loguru import logger

from global_utils import download_global_data
from local_utils import download_local_data

if __name__ == '__main__':
    while True:
        try:
            download_global_data()
            sleep(30)
            download_local_data()
            sleep(30)
        except NotImplementedError:
            logger.error('download_local_data not implemented yet')
            continue
        except Exception as e:
            logger.error(str(e))
            sleep(60)

