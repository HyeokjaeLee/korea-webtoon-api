import axios from 'axios';

const url = 'https://page.kakao.com/graphql';
const query = `
query staticLandingDayOfWeekSection(
    $sectionId: ID!
    $param: StaticLandingDayOfWeekParamInput!
  ) {
    staticLandingDayOfWeekSection(sectionId: $sectionId, param: $param) {
      ...Section
    }
  }
  
  fragment Section on Section {
    ... on StaticLandingDayOfWeekSection {
      isEnd
      totalCount
    }
    groups {
      ...Group
    }
  }
  
  fragment Item on Item {
    ...BannerItem
    ...OnAirItem
    ...CardViewItem
    ...CleanViewItem
    ...PosterViewItem
    ...StrategyViewItem
    ...SimplePosterViewItem
    ...RankingListViewItem
    ...NormalListViewItem
    ...MoreItem
    ...EventBannerItem
  }
  
  fragment BannerItem on BannerItem {
    thumbnail
    badgeList
    statusBadge
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment EventLogFragment on EventLog {
    eventMeta {
      id
      name
    }
  }
  
  fragment OnAirItem on OnAirItem {
    thumbnail
    subtitleList
  }
  
  fragment CardViewItem on CardViewItem {
    thumbnail
    badgeList
    statusBadge
    ageGrade
    subtitleList
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment CleanViewItem on CleanViewItem {
    id
    thumbnail
    badgeList
    statusBadge
    subtitleList
    ageGrade
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment PosterViewItem on PosterViewItem {
    id
    thumbnail
    badgeList
    statusBadge
    subtitleList
    ageGrade
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment StrategyViewItem on StrategyViewItem {
    id
    count
  }
  
  fragment SimplePosterViewItem on SimplePosterViewItem {
    thumbnail
    badgeList
    statusBadge
    ageGrade
  }
  
  fragment RankingListViewItem on RankingListViewItem {
    thumbnail
    badgeList
    statusBadge
    ageGrade
    metaList
    descriptionList
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment NormalListViewItem on NormalListViewItem {
    id
    thumbnail
    badgeList
    statusBadge
    ageGrade
    ageGrade
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment MoreItem on MoreItem {
    id
  }
  
  fragment EventBannerItem on EventBannerItem {
    thumbnail
    subtitleList
    eventLog {
      ...EventLogFragment
    }
  }
  
  fragment Group on Group {
    id
    ... on ListViewGroup {
      meta {
        count
      }
    }
    groups {
      ...GroupInGroup
    }
    items {
      ...Item
    }
  }
  
  fragment GroupInGroup on Group {
    id
    items {
      ...Item
    }
    ... on ListViewGroup {
      meta {
        count
      }
    }
  }
`;

export enum DayTabUid {
  SUN = 7,
  MON = 1,
  TUE = 2,
  WED = 3,
  THU = 4,
  FRI = 5,
  SAT = 6,
  FINISH = 12,
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

export const requestKakaoPageWebtoons = async (
  dayTabUid: DayTabUid,
  page: number,
) => {
  const { data } = await axios<RequestResult>({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    url,
    data: {
      query,
      variables: {
        sectionId: `static-landing-DayOfWeek-section-Layout-10-0-A-${dayTabUid}`,
        param: {
          categoryUid: 10,
          bmType: 'A',
          subcategoryUid: '0',
          dayTabUid: '1',
          page,
        },
      },
    },
  });

  return data.data.staticLandingDayOfWeekSection;
};
