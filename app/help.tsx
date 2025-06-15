import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  isPopular?: boolean;
}

const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'play.circle',
    articles: [
      {
        id: '1',
        title: 'Creating Your First Character',
        description: 'Learn how to create and customize your D&D character',
        isPopular: true,
      },
      {
        id: '2',
        title: 'Joining a Campaign',
        description: 'Find and join campaigns with other players',
        isPopular: true,
      },
      {
        id: '3',
        title: 'Using the Dice Roller',
        description: 'Master the built-in dice rolling system',
      },
      {
        id: '4',
        title: 'Setting Up Your Profile',
        description: 'Customize your profile and preferences',
      },
    ],
  },
  {
    id: 'characters',
    title: 'Characters',
    icon: 'person',
    articles: [
      {
        id: '5',
        title: 'Character Sheet Management',
        description: 'How to manage and update your character sheets',
      },
      {
        id: '6',
        title: 'Ability Scores and Modifiers',
        description: 'Understanding ability scores and how they work',
      },
      {
        id: '7',
        title: 'Equipment and Inventory',
        description: 'Managing your character\'s equipment and items',
      },
      {
        id: '8',
        title: 'Spells and Magic',
        description: 'Casting spells and managing spell slots',
      },
    ],
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    icon: 'map',
    articles: [
      {
        id: '9',
        title: 'Creating a Campaign',
        description: 'Set up your own campaign as a Dungeon Master',
        isPopular: true,
      },
      {
        id: '10',
        title: 'Managing Players',
        description: 'Invite and manage players in your campaign',
      },
      {
        id: '11',
        title: 'Session Planning',
        description: 'Plan and organize your game sessions',
      },
      {
        id: '12',
        title: 'Campaign Settings',
        description: 'Configure campaign rules and settings',
      },
    ],
  },
  {
    id: 'groups',
    title: 'Groups & Communities',
    icon: 'person.3',
    articles: [
      {
        id: '13',
        title: 'Finding Groups',
        description: 'Discover and join gaming communities',
      },
      {
        id: '14',
        title: 'Creating a Group',
        description: 'Start your own gaming community',
      },
      {
        id: '15',
        title: 'Group Moderation',
        description: 'Managing and moderating your group',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: 'wrench',
    articles: [
      {
        id: '16',
        title: 'Common Issues',
        description: 'Solutions to frequently encountered problems',
      },
      {
        id: '17',
        title: 'Performance Issues',
        description: 'Improving app performance and speed',
      },
      {
        id: '18',
        title: 'Sync Problems',
        description: 'Fixing data synchronization issues',
      },
    ],
  },
];

const POPULAR_ARTICLES = HELP_CATEGORIES.flatMap(category => 
  category.articles.filter(article => article.isPopular)
);

export default function HelpScreen() {
  const router = useRouter();
  const primary = useThemeColor({}, 'primary');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@roll20reforged.com?subject=Help Request');
  };

  const handleOpenArticle = (articleId: string) => {
    // In a real app, this would navigate to the article detail page
    console.log('Opening article:', articleId);
  };

  const filteredCategories = selectedCategory 
    ? HELP_CATEGORIES.filter(cat => cat.id === selectedCategory)
    : HELP_CATEGORIES;

  const searchResults = searchQuery.trim() 
    ? HELP_CATEGORIES.flatMap(category => 
        category.articles.filter(article => 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : [];

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Help Center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <SFSymbol name="chevron.left" color={text} size={24} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
          />
        </View>

        {/* Search Results */}
        {searchQuery.trim() && (
          <Card style={styles.searchResultsCard} variant="elevated">
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Search Results
            </ThemedText>
            {searchResults.length > 0 ? (
              <View style={styles.articlesList}>
                {searchResults.map((article) => (
                  <TouchableOpacity
                    key={article.id}
                    style={styles.articleItem}
                    onPress={() => handleOpenArticle(article.id)}
                  >
                    <View style={styles.articleContent}>
                      <ThemedText type="semiBold" style={styles.articleTitle}>
                        {article.title}
                      </ThemedText>
                      <ThemedText style={[styles.articleDescription, { color: muted }]}>
                        {article.description}
                      </ThemedText>
                    </View>
                    <SFSymbol name="chevron.right" color={muted} size={16} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <ThemedText style={[styles.noResults, { color: muted }]}>
                No articles found for "{searchQuery}"
              </ThemedText>
            )}
          </Card>
        )}

        {/* Popular Articles */}
        {!searchQuery.trim() && (
          <Card style={styles.popularCard} variant="elevated">
            <View style={styles.popularHeader}>
              <SFSymbol name="star.fill" color={success} size={20} />
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Popular Articles
              </ThemedText>
            </View>
            
            <View style={styles.articlesList}>
              {POPULAR_ARTICLES.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleItem}
                  onPress={() => handleOpenArticle(article.id)}
                >
                  <View style={styles.articleContent}>
                    <ThemedText type="semiBold" style={styles.articleTitle}>
                      {article.title}
                    </ThemedText>
                    <ThemedText style={[styles.articleDescription, { color: muted }]}>
                      {article.description}
                    </ThemedText>
                  </View>
                  <SFSymbol name="chevron.right" color={muted} size={16} />
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        {/* Categories */}
        {!searchQuery.trim() && (
          <>
            <View style={styles.categoriesHeader}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                Browse by Category
              </ThemedText>
              {selectedCategory && (
                <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                  <ThemedText style={[styles.showAllText, { color: primary }]}>
                    Show All
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>

            {!selectedCategory && (
              <View style={styles.categoriesGrid}>
                {HELP_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Card style={styles.categoryCardInner} variant="elevated">
                      <View style={[styles.categoryIcon, { backgroundColor: `${primary}20` }]}>
                        <SFSymbol name={category.icon as any} color={primary} size={24} />
                      </View>
                      <ThemedText type="semiBold" style={styles.categoryTitle}>
                        {category.title}
                      </ThemedText>
                      <ThemedText style={[styles.categoryCount, { color: muted }]}>
                        {category.articles.length} articles
                      </ThemedText>
                    </Card>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Category Articles */}
            {filteredCategories.map((category) => (
              <Card key={category.id} style={styles.categoryArticlesCard} variant="elevated">
                <ThemedText type="subtitle" style={styles.sectionTitle}>
                  {category.title}
                </ThemedText>
                
                <View style={styles.articlesList}>
                  {category.articles.map((article) => (
                    <TouchableOpacity
                      key={article.id}
                      style={styles.articleItem}
                      onPress={() => handleOpenArticle(article.id)}
                    >
                      <View style={styles.articleContent}>
                        <View style={styles.articleTitleRow}>
                          <ThemedText type="semiBold" style={styles.articleTitle}>
                            {article.title}
                          </ThemedText>
                          {article.isPopular && (
                            <View style={styles.popularBadge}>
                              <SFSymbol name="star.fill" color={success} size={12} />
                            </View>
                          )}
                        </View>
                        <ThemedText style={[styles.articleDescription, { color: muted }]}>
                          {article.description}
                        </ThemedText>
                      </View>
                      <SFSymbol name="chevron.right" color={muted} size={16} />
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            ))}
          </>
        )}

        {/* Contact Support */}
        <Card style={styles.supportCard} variant="elevated">
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Still Need Help?
          </ThemedText>
          <ThemedText style={[styles.supportDescription, { color: muted }]}>
            Can't find what you're looking for? Our support team is here to help.
          </ThemedText>
          
          <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
            <SFSymbol name="envelope" color={primary} size={20} />
            <ThemedText style={[styles.supportButtonText, { color: primary }]}>
              Contact Support
            </ThemedText>
            <SFSymbol name="arrow.up.right" color={primary} size={16} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchResultsCard: {
    margin: 20,
    padding: 20,
  },
  popularCard: {
    margin: 20,
    padding: 20,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  showAllText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  categoryCard: {
    width: '48%',
  },
  categoryCardInner: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    textAlign: 'center',
  },
  categoryArticlesCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
  },
  articlesList: {
    gap: 4,
    marginTop: 16,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  articleContent: {
    flex: 1,
  },
  articleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 16,
    flex: 1,
  },
  popularBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 20,
  },
  supportCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    padding: 20,
  },
  supportDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  supportButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
});