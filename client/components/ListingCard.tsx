import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useListings, LuggageListing } from "@/contexts/ListingsContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { EditListingModal } from "./EditListingModal";
import {
  MoreVertical,
  Edit,
  Archive,
  ArchiveRestore,
  Trash2,
  MapPin,
  DollarSign,
} from "lucide-react";

interface ListingCardProps {
  listing: LuggageListing;
  isOwner?: boolean;
  showArchived?: boolean;
}

export function ListingCard({ listing, isOwner = false, showArchived = false }: ListingCardProps) {
  const { deleteListing, archiveListing, unarchiveListing } = useListings();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteListing(listing.id);
      toast({
        title: t("listing.delete"),
        description: "Listing has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      if (listing.isArchived) {
        await unarchiveListing(listing.id);
        toast({
          title: t("listing.unarchive"),
          description: "Listing has been restored and is now visible.",
        });
      } else {
        await archiveListing(listing.id);
        toast({
          title: t("listing.archive"),
          description: "Listing has been archived and is no longer visible in search.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className={`overflow-hidden ${listing.isArchived ? 'opacity-60' : ''}`}>
      <div className="relative">
        <img
          src={listing.images[0] || '/placeholder.svg'}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        {listing.isArchived && (
          <Badge variant="secondary" className="absolute top-2 left-2">
            {t("listing.archived")}
          </Badge>
        )}
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditListingModal listing={listing}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("common.edit")}
                </DropdownMenuItem>
              </EditListingModal>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    {listing.isArchived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-2" />
                        {t("listing.unarchive")}
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-2" />
                        {t("listing.archive")}
                      </>
                    )}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {listing.isArchived ? t("listing.unarchive") : t("listing.archive")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {listing.isArchived 
                        ? "This will make your listing visible in search results again."
                        : t("listing.confirmArchive")
                      }
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleArchive}
                      disabled={isArchiving}
                    >
                      {isArchiving ? "Processing..." : t("common.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t("common.delete")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("listing.delete")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("listing.confirmDelete")} This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : t("common.delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2">{listing.title}</h3>
            <div className="flex gap-1">
              {listing.pricing.isForSale && (
                <Badge variant="outline" className="text-xs">
                  {t("search.forSale")}
                </Badge>
              )}
              {listing.pricing.isForRent && (
                <Badge variant="outline" className="text-xs">
                  {t("search.forRent")}
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{listing.location.city}, {listing.location.state}</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4" />
            <span className="font-semibold">
              {listing.pricing.isForRent && (
                <span>{formatPrice(listing.pricing.dailyRate)}/day</span>
              )}
              {listing.pricing.isForSale && listing.pricing.isForRent && <span> | </span>}
              {listing.pricing.isForSale && listing.pricing.sellPrice && (
                <span>{formatPrice(listing.pricing.sellPrice)} {t("search.forSale")}</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {t(`category.${listing.category}`)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t(`common.${listing.condition}`)}
            </Badge>
          </div>
        </div>
      </CardContent>

      {!isOwner && (
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            {listing.pricing.isForRent && (
              <Button className="flex-1">
                {t("common.rent")}
              </Button>
            )}
            {listing.pricing.isForSale && (
              <Button variant={listing.pricing.isForRent ? "outline" : "default"} className="flex-1">
                {t("common.buy")}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
