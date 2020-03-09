import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {pv, SIZE, WEIGHT} from '../../common/common';
import Container from '../../components/Container';
import {TagsPlaceHolder} from '../../components/ListPlaceholders';
import {useTracked} from '../../provider';
import {ACTIONS} from '../../provider/actions';
import NavigationService from '../../services/NavigationService';
import {ToastEvent} from '../../utils/utils';
import {useIsFocused} from 'react-navigation-hooks';
import {inputRef} from '../../components/SearchInput';
const w = Dimensions.get('window').width;
const h = Dimensions.get('window').height;

export const Tags = ({navigation}) => {
  const [state, dispatch] = useTracked();
  const {colors, tags, selectionMode} = state;
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  const searchResults = {...state.searchResults};
  useEffect(() => {
    if (isFocused) {
      dispatch({type: ACTIONS.TAGS});
      dispatch({
        type: ACTIONS.CURRENT_SCREEN,
        screen: 'tags',
      });
    }
  }, [isFocused]);

  return (
    <Container
      canGoBack={false}
      heading="Tags"
      noBottomButton={true}
      placeholder="Search for #tags"
      data={tags}
      type="tags"
      menu>
      <View
        style={{
          width: '100%',
          alignSelf: 'center',
          height: '100%',
          paddingHorizontal: 12,
        }}>
        <FlatList
          style={{
            height: '100%',
          }}
          ListHeaderComponent={
            searchResults.type === 'tags' &&
            searchResults.results.length > 0 ? (
              <View
                style={{
                  marginTop:
                    Platform.OS == 'ios'
                      ? tags[0] && !selectionMode
                        ? 135
                        : 135 - 60 && !selectionMode
                      : tags[0]
                      ? 155
                      : 155 - 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 0,
                }}>
                <Text
                  style={{
                    fontFamily: WEIGHT.bold,
                    color: colors.accent,
                    fontSize: SIZE.xs,
                  }}>
                  Search Results for {searchResults.keyword}
                </Text>
                <Text
                  onPress={() => {
                    inputRef.current?.setNativeProps({
                      text: '',
                    });
                    dispatch({
                      type: ACTIONS.SEARCH_RESULTS,
                      results: {
                        results: [],
                        type: null,
                        keyword: null,
                      },
                    });
                  }}
                  style={{
                    fontFamily: WEIGHT.regular,
                    color: colors.errorText,
                    fontSize: SIZE.xs,
                  }}>
                  Clear
                </Text>
              </View>
            ) : (
              <View
                style={{
                  marginTop:
                    Platform.OS == 'ios'
                      ? tags[0] && !selectionMode
                        ? 135
                        : 135 - 60
                      : tags[0] && !selectionMode
                      ? 155
                      : 155 - 60,
                }}
              />
            )
          }
          refreshControl={
            <RefreshControl
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressViewOffset={165}
              onRefresh={async () => {
                setRefreshing(true);
                try {
                  await db.sync();
                  dispatch({type: ACTIONS.TAGS});
                  dispatch({type: ACTIONS.USER});
                  setRefreshing(false);
                  ToastEvent.show('Sync Complete', 'success');
                } catch (e) {
                  setRefreshing(false);
                  ToastEvent.show('Sync failed, network error', 'error');
                }
              }}
              refreshing={refreshing}
            />
          }
          contentContainerStyle={{
            height: '100%',
          }}
          data={
            searchResults.type === 'tags' &&
            isFocused &&
            searchResults.results.length > 0
              ? searchResults.results
              : tags
          }
          ListEmptyComponent={
            <View
              style={{
                height: '80%',
                width: '100%',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                opacity: 0.8,
              }}>
              <TagsPlaceHolder colors={colors} />
              <Text
                style={{
                  fontSize: SIZE.sm,
                  color: colors.icon,
                }}>
                Tags added to notes appear here
              </Text>
            </View>
          }
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={item.title}
              onPress={() => {
                NavigationService.navigate('Notes', {
                  type: 'tag',
                  title: item.title,
                  tag: item,
                });
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                margin: 0,
                paddingVertical: pv,
                borderBottomWidth: 1.5,
                borderBottomColor: colors.nav,
              }}>
              <Text
                style={{
                  fontFamily: WEIGHT.regular,
                  fontSize: SIZE.md,
                  color: colors.pri,
                }}>
                <Text
                  style={{
                    color: colors.accent,
                  }}>
                  #
                </Text>
                {item.title}
                {'\n'}
                <Text
                  style={{
                    fontSize: SIZE.xs,
                    color: colors.icon,
                  }}>
                  {item && item.count && item.count > 1
                    ? item.count + ' notes'
                    : item.count === 1
                    ? item.count + ' note'
                    : null}
                </Text>
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Container>
  );
};

Tags.navigationOptions = {
  header: null,
};

export default Tags;
