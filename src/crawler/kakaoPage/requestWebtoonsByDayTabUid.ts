import axios from 'axios';
import { consoleWithTime } from 'utils';
import { KAKAO_PAGE_API_URL } from '.';

const QUERY = `query staticLandingDayOfWeekSection($sectionId: ID!, $param: StaticLandingDayOfWeekParamInput!) {
  staticLandingDayOfWeekSection(sectionId: $sectionId, param: $param) {
    ...Section
    __typename
  }
}

fragment Section on Section {
  id
  uid
  type
  title
  ... on DependOnLoggedInSection {
    loggedInTitle
    loggedInScheme
    __typename
  }
  ... on SchemeSection {
    scheme
    __typename
  }
  ... on MetaInfoTypeSection {
    metaInfoType
    __typename
  }
  ... on TabSection {
    sectionMainTabList {
      uid
      title
      isSelected
      scheme
      additionalString
      subTabList {
        uid
        title
        isSelected
        groupId
        __typename
      }
      __typename
    }
    __typename
  }
  ... on ThemeKeywordSection {
    themeKeywordList {
      uid
      title
      scheme
      __typename
    }
    __typename
  }
  ... on StaticLandingDayOfWeekSection {
    isEnd
    totalCount
    displayAd {
      sectionUid
      bannerUid
      treviUid
      momentUid
      __typename
    }
    param {
      categoryUid
      businessModel {
        name
        param
        __typename
      }
      subcategory {
        name
        param
        __typename
      }
      dayTab {
        name
        param
        __typename
      }
      page
      size
      __typename
    }
    businessModelList {
      name
      param
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    dayTabList {
      name
      param
      __typename
    }
    __typename
  }
  ... on StaticLandingTodayNewSection {
    totalCount
    param {
      categoryUid
      subcategory {
        name
        param
        __typename
      }
      __typename
    }
    categoryTabList {
      name
      param
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    __typename
  }
  ... on StaticLandingTodayUpSection {
    isEnd
    totalCount
    param {
      categoryUid
      subcategory {
        name
        param
        __typename
      }
      page
      __typename
    }
    categoryTabList {
      name
      param
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    __typename
  }
  ... on StaticLandingRankingSection {
    isEnd
    rankingTime
    totalCount
    param {
      categoryUid
      subcategory {
        name
        param
        __typename
      }
      rankingType {
        name
        param
        __typename
      }
      page
      __typename
    }
    categoryTabList {
      name
      param
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    rankingTypeList {
      name
      param
      __typename
    }
    displayAd {
      ...DisplayAd
      __typename
    }
    __typename
  }
  ... on StaticLandingGenreSection {
    isEnd
    totalCount
    param {
      categoryUid
      subcategory {
        name
        param
        __typename
      }
      sortType {
        name
        param
        __typename
      }
      page
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    sortTypeList {
      name
      param
      __typename
    }
    displayAd {
      ...DisplayAd
      __typename
    }
    __typename
  }
  ... on StaticLandingFreeSeriesSection {
    isEnd
    totalCount
    param {
      categoryUid
      tab {
        name
        param
        __typename
      }
      page
      __typename
    }
    tabList {
      name
      param
      __typename
    }
    __typename
  }
  ... on StaticLandingEventSection {
    isEnd
    totalCount
    param {
      categoryUid
      page
      __typename
    }
    categoryTabList {
      name
      param
      __typename
    }
    __typename
  }
  ... on StaticLandingOriginalSection {
    isEnd
    totalCount
    originalCount
    param {
      categoryUid
      subcategory {
        name
        param
        __typename
      }
      sortType {
        name
        param
        __typename
      }
      isComplete
      page
      __typename
    }
    subcategoryList {
      name
      param
      __typename
    }
    sortTypeList {
      name
      param
      __typename
    }
    recommendItemList {
      ...Item
      __typename
    }
    __typename
  }
  groups {
    ...Group
    __typename
  }
}

fragment DisplayAd on DisplayAd {
  sectionUid
  bannerUid
  treviUid
  momentUid
}

fragment Item on Item {
  id
  type
  ...BannerItem
  ...OnAirItem
  ...CardViewItem
  ...CleanViewItem
  ... on DisplayAdItem {
    displayAd {
      ...DisplayAd
      __typename
    }
    __typename
  }
  ...PosterViewItem
  ...StrategyViewItem
  ...RankingListViewItem
  ...NormalListViewItem
  ...MoreItem
  ...EventBannerItem
}

fragment BannerItem on BannerItem {
  bannerType
  bannerViewType
  thumbnail
  videoUrl
  badgeList
  statusBadge
  titleImage
  title
  metaList
  caption
  scheme
  seriesId
  eventLog {
    ...EventLogFragment
    __typename
  }
}

fragment EventLogFragment on EventLog {
  click {
    layer1
    layer2
    setnum
    ordnum
    copy
    imp_id
    imp_provider
    __typename
  }
  eventMeta {
    id
    name
    subcategory
    category
    series
    provider
    series_id
    type
    __typename
  }
  viewimp_contents {
    type
    name
    id
    imp_area_ordnum
    imp_id
    imp_provider
    imp_type
    layer1
    layer2
    __typename
  }
  customProps {
    landing_path
    view_type
    toros_imp_id
    toros_file_hash_key
    toros_event_meta_id
    content_cnt
    event_series_id
    event_ticket_type
    play_url
    banner_uid
    __typename
  }
}

fragment OnAirItem on OnAirItem {
  thumbnail
  videoUrl
  titleImage
  title
  subtitleList
  caption
  scheme
}

fragment CardViewItem on CardViewItem {
  title
  thumbnail
  titleImage
  scheme
  badgeList
  ageGradeBadge
  statusBadge
  ageGrade
  selfCensorship
  torosImgId
  torosFileHashKey
  subtitleList
  caption
  eventLog {
    ...EventLogFragment
    __typename
  }
}

fragment CleanViewItem on CleanViewItem {
  id
  type
  showPlayerIcon
  scheme
  title
  thumbnail
  badgeList
  ageGradeBadge
  statusBadge
  subtitleList
  rank
  torosFileHashKey
  torosImgId
  ageGrade
  selfCensorship
  eventLog {
    ...EventLogFragment
    __typename
  }
}

fragment PosterViewItem on PosterViewItem {
  id
  type
  showPlayerIcon
  scheme
  title
  thumbnail
  badgeList
  ageGradeBadge
  statusBadge
  subtitleList
  rank
  torosFileHashKey
  torosImgId
  ageGrade
  selfCensorship
  eventLog {
    ...EventLogFragment
    __typename
  }
  seriesId
}

fragment StrategyViewItem on StrategyViewItem {
  id
  title
  count
  scheme
}

fragment RankingListViewItem on RankingListViewItem {
  title
  thumbnail
  badgeList
  ageGradeBadge
  statusBadge
  ageGrade
  selfCensorship
  metaList
  descriptionList
  scheme
  torosImgId
  torosFileHashKey
  rank
  eventLog {
    ...EventLogFragment
    __typename
  }
}

fragment NormalListViewItem on NormalListViewItem {
  id
  type
  ticketUid
  thumbnail
  badgeList
  ageGradeBadge
  statusBadge
  ageGrade
  isAlaramOn
  row1
  row2
  row3 {
    id
    metaList
    __typename
  }
  row4
  row5
  scheme
  continueScheme
  nextProductScheme
  continueData {
    ...ContinueInfoFragment
    __typename
  }
  torosImpId
  torosFileHashKey
  seriesId
  isCheckMode
  isChecked
  isReceived
  showPlayerIcon
  rank
  isSingle
  singleSlideType
  ageGrade
  selfCensorship
  eventLog {
    ...EventLogFragment
    __typename
  }
  giftEventLog {
    ...EventLogFragment
    __typename
  }
}

fragment ContinueInfoFragment on ContinueInfo {
  title
  isFree
  productId
  lastReadProductId
  scheme
  continueProductType
  hasNewSingle
  hasUnreadSingle
}

fragment MoreItem on MoreItem {
  id
  scheme
  title
}

fragment EventBannerItem on EventBannerItem {
  bannerType
  thumbnail
  videoUrl
  titleImage
  title
  subtitleList
  caption
  scheme
  eventLog {
    ...EventLogFragment
    __typename
  }
}

fragment Group on Group {
  id
  ... on ListViewGroup {
    meta {
      title
      count
      __typename
    }
    __typename
  }
  type
  dataKey
  groups {
    ...GroupInGroup
    __typename
  }
  items {
    ...Item
    __typename
  }
}

fragment GroupInGroup on Group {
  id
  type
  dataKey
  items {
    ...Item
    __typename
  }
  ... on ListViewGroup {
    meta {
      title
      count
      __typename
    }
    __typename
  }
}`;

export enum DayTabUid {
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
  SUN = 7,
  FINISHED = 12,
}

export interface KakaoPageWebtoon {
  thumbnail: string;
  badgeList: string[];
  statusBadge: string;
  ageGrade: string;
  subtitleList: string[];
  eventLog: {
    eventMeta: {
      id: string;
      name: string;
    };
  };
}

interface RequestResult {
  data: {
    staticLandingDayOfWeekSection: {
      isEnd: boolean;
      totalCount: number;
      groups: {
        items: KakaoPageWebtoon[];
      }[];
    };
  };
}

const requestKakaoPageWebtoons = async (
  dayTabUid: DayTabUid,
  page: number,
  errorCount = 0,
) => {
  try {
    const { data } = await axios<RequestResult>({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      url: KAKAO_PAGE_API_URL,
      data: {
        query: QUERY,
        variables: {
          sectionId: `static-landing-DayOfWeek-section-Layout-10-0-A-${dayTabUid}`,
          param: {
            categoryUid: 10,
            bmType: 'A',
            subcategoryUid: '0',
            dayTabUid: String(dayTabUid),
            page,
          },
        },
      },
    });

    return data.data.staticLandingDayOfWeekSection;
  } catch {
    errorCount++;
    const errorMessage = `카카오 페이지 웹툰 dayTabUid: ${dayTabUid}, page: ${page} 요청 실패`;
    consoleWithTime(`${errorMessage} ${errorCount}번째 재시도`);
    if (errorCount > 10) {
      throw new Error(errorMessage);
    }
    return requestKakaoPageWebtoons(dayTabUid, page, errorCount + 1);
  }
};

export const requestWebtoonsByDayTabUid = async (dayTabUid: DayTabUid) => {
  const webtoons: KakaoPageWebtoon[] = [];

  for (let page = 0, isEndPage = false; !isEndPage; page++) {
    const { isEnd, groups } = await requestKakaoPageWebtoons(dayTabUid, page),
      { items } = groups[0];

    webtoons.push(...items);

    isEndPage = isEnd;
  }

  return webtoons;
};
