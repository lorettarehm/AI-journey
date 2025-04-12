
import React from 'react';
import LoadingSkeleton from "@/components/profile/settings/personal-info/LoadingSkeleton";
import LibrarySearch from '@/components/library/LibrarySearch';
import LibrarySorting from '@/components/library/LibrarySorting';
import EmptyLibraryState from '@/components/library/EmptyLibraryState';
import LibraryContentItem from '@/components/library/LibraryContentItem';
import { useLibraryContent } from '@/components/library/useLibraryContent';

const LibraryContentList = () => {
  const {
    contents,
    filteredContents,
    isLoading,
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    handleRefresh,
    clearSearch,
    toggleSortOrder
  } = useLibraryContent();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return <EmptyLibraryState isFiltered={false} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Library Contents ({filteredContents.length})</h2>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <LibrarySearch 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <LibrarySorting 
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          handleRefresh={handleRefresh}
        />
      </div>
      
      {filteredContents.length === 0 ? (
        <EmptyLibraryState 
          isFiltered={true} 
          clearSearch={clearSearch} 
        />
      ) : (
        <>
          {filteredContents.map((content) => (
            <LibraryContentItem key={content.id} content={content} />
          ))}
        </>
      )}
    </div>
  );
};

export default LibraryContentList;
