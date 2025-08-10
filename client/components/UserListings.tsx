import { useState } from "react";
import { useListings } from "@/contexts/ListingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ListingCard } from "./ListingCard";
import { Plus, Package, Archive } from "lucide-react";

export function UserListings() {
  const { userListings, archivedListings } = useListings();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("listing.myListings")}</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Listing
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Active ({userListings.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            {t("listing.archived")} ({archivedListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isOwner={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("listing.noListings")}
                </h3>
                <p className="text-muted-foreground mb-6">
                  You haven't created any listings yet. Start by creating your
                  first storage listing.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isOwner={true}
                  showArchived={true}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Archive className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t("listing.archivedListings")}
                </h3>
                <p className="text-muted-foreground">
                  You don't have any archived listings.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
