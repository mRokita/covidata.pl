from os import environ
from time import sleep
from loguru import logger

from common import HTTPError
from global_utils import GlobalCrawler
from local_utils import LocalCrawler
from time import sleep
CRAWLERS = [GlobalCrawler, LocalCrawler]


if __name__ == '__main__':
    if environ.get(
            'STAGE', 'PRODUCTION') != 'DEBUG':
        sleep(15)
    GlobalCrawler.update_name_to_iso2()
    while True:
        for crawler in CRAWLERS:
            logger.info(f"Running crawler"
                        f" {crawler.__name__}...")
            for d in crawler.get_missing_record_dates():
                logger.info(f"{crawler.__name__}: Fetching data for {d}...")
                try:
                    crawler(d).fetch()
                    logger.info(f"Downloaded data using crawler"
                                f" {crawler.__name__} for date {d}")
                    sleep(1)
                except crawler.DataNotAvailable as e:
                    logger.warning(
                        f"{crawler.__name__}: Data not available for {d}...")
                except HTTPError as e:
                    logger.error(e)
        sleep(50)


