from json import loads
import re
from typing import List

from httpx import Client
from loguru import logger
from config import WAYBACK_SNAPSHOT_LIST_URL, PL_GOV_URL


def get_archive_urls_for_gov() -> List[str]:
    """
    Retrieve urls for web.archive.org snapshots of gov.pl cov site
    :return: Urls for gov.pl COV site
    """
    with Client() as c:
        res = c.get(WAYBACK_SNAPSHOT_LIST_URL)
    urls = []
    for snap in res.json().get('items', []):
        snap_timestamp = str(snap[0])
        if len(snap_timestamp) == 9:
            # Add trailing 0 because wayback loses them by sending integers
            snap_timestamp = '0' + snap_timestamp
            urls.append(
                f'http://web.archive.org/web/{snap_timestamp}id_/{PL_GOV_URL}'
            )
    logger.info(f'Found {len(urls)} snapshots for www.gov.pl cov site')
    return urls


def find_data_tag(url: str) -> str:
    with Client() as c:
        res = c.get(url)
        for line in res.iter_lines():
            if 'id="registerData"' in line:
                return line


def get_data_from_gov_pl(url) -> dict:
    """
    Download data, get the tag with json stats,
    then strip html tags and return a dict containing stats
    :param url: Url of the gov.pl site containing coronavirus stats
    :return: A dict containing deserialized stats
    """
    tag = find_data_tag(url)
    return loads(re.sub('<(.+?)>', '', tag))


def get_latest_data_from_gov_pl(url=PL_GOV_URL) -> dict:
    return get_data_from_gov_pl(url)


def download_local_data():
    raise NotImplementedError
